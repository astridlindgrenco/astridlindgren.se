var Prismic = require('prismic-javascript')

/**
 * For a given page (ctx.doc) this function fetches linked parts like
 * 'characters', 'footers' and 'quotes' documents and cache them in the
 * state storage.
 *
 * This function should be called before any rendering of a page.
 *
 * @param {Object} ctx - The Koa context object.
 */
module.exports = async function addLinkedParts (ctx, next) {
  await Promise.all([
    addCharacters(ctx),
    addSubDocuments(ctx.state.doc.data, ctx)
  ])
  return next()
}

/**
 * Recursivly gets referenced documents. Uses 'uniqueIds' to ensure
 * each document is only fetched once from Prismic. This could not
 * be solved with a Map in ctx.state.linkedDocuments[] only becuase
 * of set-operation of a Map is not synchronous.
 *
 * @param {Object} ctx - The Koa context object.
 * @param {Object} data - A Prismic document object with referenced documents.
 */
async function addSubDocuments (data, ctx) {
  for (var key in data) {
    if (typeof data[key] === 'object' && data[key] !== null) {
      if (data[key] && data[key].id && data[key].type !== 'page') {
        let type = data[key].type.replace('_ref', '') + '_ref'
        if (!ctx.state.linkedDocuments[type]) ctx.state.linkedDocuments[type] = new Map()
        if (!ctx.state.linkedDocuments[type].get(data[key].id)) {
          // Store an empty object to prevent possible multiple recursive fetches until resolved promise.
          ctx.state.linkedDocuments[type].set(data[key].id, {})
          try {
            ctx.state.linkedDocuments[type].set(data[key].id, await ctx.prismic.getByID(data[key].id))
          } catch (e) {
            ctx.state.linkedDocuments[type].delete(data[key].id)
            console.error('addSubDocuments', e)
          }
        }
      } else {
        await addSubDocuments(data[key], ctx)
      }
    }
  }
}

/**
 * Fetches and stores referenced slices for 'characters'.
 *
 * @param {Object} ctx - The Koa context object.
 */
async function addCharacters (ctx) {
  if (ctx.state.doc.body && ctx.state.doc.body.length) {
    const characterSlices = ctx.doc.body.filter(slice => slice.slice_type === 'characters')
    if (characterSlices.length > 0) {
      const prismicOpts = {
        lang: ctx.state.lang,
        fetch: ['page.title', 'page.list_image'],
        orderings: '[my.page.title]',
        ref: ctx.state.ref
      }
      await Promise.all(characterSlices.map(async function getCharacterDocs (characterSlice) {
        if (characterSlice.items && characterSlice.items.length > 0) {
          // If it has priority or manually added characters fetch by ID
          const prismicPredicates = [ Prismic.Predicates.in('document.id', characterSlice.items.map(item => item.priority_character.id)) ]
          try {
            const response = await ctx.prismic.query(prismicPredicates, prismicOpts)
            const resultsWithImage = response.results.filter(doc => Boolean(doc.data.list_image.url))
            ctx.state.characters.items.push(...resultsWithImage)
          } catch (e) {
            console.error('addCharacters', e)
          }
        }
      }))
    }
  }
}
