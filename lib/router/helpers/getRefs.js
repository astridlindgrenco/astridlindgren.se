var Prismic = require('prismic-javascript')

/**
 * For a given document, this function fetches referenced sub-documents like
 * 'characters', 'footers' and 'quotes' and cache them in the state storage.
 *
 * This function should be called before any rendering of a viewable document type,
 * typically from the corresponding router functions.
 *
 * @param {Object} document - The Prismic document object with referenced documents.
 * @param {Object} ctx - The Koa context object.
 */
module.exports = async function getRefs (document, ctx) {
  return Promise.all([
    addCharacters(document, ctx),
    addSubDocuments(document, ctx)
  ])
}

/**
 * Recursivly gets referenced documents. Uses 'uniqueIds' to ensure
 * each document is only fetched once from Prismic. This could not
 * be solved with a Map in ctx.state.linkedDocuments[] only becuase
 * of set-operation of a Map is not synchronous.
 *
 * @param {Object} document - A Prismic document object with referenced documents.
 * @param {Object} ctx - The Koa context object.
 */
async function addSubDocuments (document, ctx) {
  for (var key in document) {
    if (typeof document[key] === 'object' && document[key] !== null) {
      if (document[key] && document[key].id && document[key].type !== 'page') {
        let type = document[key].type.replace('_ref', '') + '_ref'
        if (!ctx.state.linkedDocuments[type]) ctx.state.linkedDocuments[type] = new Map()
        if (!ctx.state.linkedDocuments[type].get(document[key].id)) {
          // Store an empty object to prevent possible multiple recursive fetches until resolved promise.
          ctx.state.linkedDocuments[type].set(document[key].id, {})
          try {
            ctx.state.linkedDocuments[type].set(document[key].id, await ctx.prismic.getByID(document[key].id))
          } catch (e) {
            ctx.state.linkedDocuments[type].delete(document[key].id)
            console.error('addSubDocuments', e)
          }
        }
      } else {
        await addSubDocuments(document[key], ctx)
      }
    }
  }
}

/**
 * Fetches and stores referenced slices for 'characters'.
 *
 * @param {Object} document - A Prismic document object with character slices.
 * @param {Object} ctx - The Koa context object.
 */
async function addCharacters (document, ctx) {
  if (document.body && document.body.length) {
    const characterSlices = document.body.filter(slice => slice.slice_type === 'characters')
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
