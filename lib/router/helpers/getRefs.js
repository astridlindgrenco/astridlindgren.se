var Prismic = require('prismic-javascript')

/**
 * Finds and request each prismic object reference by looping through
 * data and it's childern recursivly by calling eachRecursive.
 *
 * It'll then place the response in ctx.state.linkedDocuments[key]
 * where key = the referred document's name.
 *
 * If ctx.state.linkedDocuments or ctx.state.linkedDocuments[key]
 * is null or undefined it'll instantiate a new empty object
 * at the location.
 *
 * @param {data} object prismic document body
 * @param {ctx} function koa context
 */
module.exports = async function getRefs (data, ctx) {
  // Prepare state storage of linked documents
  if (!ctx.state.linkedDocuments) ctx.state.linkedDocuments = {}

  // Handle dependencies outside that isn't found in a Prismic document link
  if (data.body && data.body.length) await handleNonLinkedDependencies(ctx, data.body)

  // The use of uniqueIds ensures that referenced documents are onle fetched once
  // from prismic and storded into the ctx.state.linkedDocuments.
  const uniqueIds = new Set()

  // Now, get all the referenced documents:
  await Promise.all(Object.keys(data).map(async (key, index) => {
    if (data[key]) {
      if (!ctx.state.linkedDocuments[key]) ctx.state.linkedDocuments[key] = new Map()
      if (data[key].id && data[key].isBroken !== undefined) {
        ctx.state.linkedDocuments[key].set(data[key].id, await ctx.prismic.getByID(data[key].id))
      } else {
        await addRecursive(data, ctx, uniqueIds)
      }
    }
  }))
}

/**
 * Recursivly gets referenced documents. Uses 'uniqueIds' to ensure
 * each document is only fetched once from Prismic. This could not
 * be solved with a Map in ctx.state.linkedDocuments[] only becuase
 * of set-operation of a Map is not synchronous.
 * @param {Object} data - The obkect with referenced documents.
 * @param {Object} ctx - The Koa context object.
 * @param {Set} uniqueIds - A set with unique Prismic document id's.
 */
async function addRecursive (data, ctx, uniqueIds) {
  Object.keys(data).map(async (key, index) => {
    if (data[key] && data[key].id && data[key].type > '') {
      let type = data[key].type.replace('_ref', '') + '_ref'
      if (!ctx.state.linkedDocuments[type]) ctx.state.linkedDocuments[type] = new Map()
      if (!ctx.state.linkedDocuments[type].get(data[key].id) && !uniqueIds.has(data[key].id)) {
        uniqueIds.add(data[key].id)
        ctx.state.linkedDocuments[type].set(data[key].id, await ctx.prismic.getByID(data[key].id))
        if (data[key].isBroken === undefined) {
          await addRecursive(data, ctx, uniqueIds)
        }
      }
    }
  })
}

/**
 * [handleNonLinkedDependencies description]
 * @param  {[type]} ctx       [description]
 * @param  {[type]} sliceBody [description]
 * @return {[type]}           [description]
 */
async function handleNonLinkedDependencies (ctx, sliceBody) {
  var characterSlices = sliceBody.filter(slice => slice.slice_type === 'characters')
  if (characterSlices) {
    return Promise.all(characterSlices.map(function getCharacterDocs (characterSlice) {
      let prismicPredicates = []
      let prismicOpts = {
        lang: ctx.state.lang,
        fetch: ['page.title', 'page.list_image'],
        orderings: '[my.page.title]',
        ref: ctx.state.ref
      }
      if (characterSlice.items.length) {
        // If it has priority or manually added characters fetch by ID
        prismicPredicates = [ Prismic.Predicates.in('document.id', characterSlice.items.map(item => item.priority_character.id)) ]
        return ctx.prismic.query(
          prismicPredicates,
          prismicOpts
        ).then((response) => {
          var resultsWithImage = response.results.filter(doc => Boolean(doc.data.list_image.url))
          ctx.state.characters.items.push(...resultsWithImage)
          return response.results
        })
      }
    })
    )
  }
}
