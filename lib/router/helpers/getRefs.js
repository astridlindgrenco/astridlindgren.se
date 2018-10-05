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
  if (!ctx.state.linkedDocuments) ctx.state.linkedDocuments = {}

  // Handle dependencies outside that isn't found in a Prismic document link
  if (data.body && data.body.length) await handleNonLinkedDependencies(ctx, data.body)

  await Promise.all(Object.keys(data).map(async (key, index) => {
    if (data[key]) {
      if (data[key] && data[key].isBroken !== undefined) {
        if (!ctx.state.linkedDocuments[key]) ctx.state.linkedDocuments[key] = new Map()

        ctx.state.linkedDocuments[key].set(data[key].id, await ctx.prismic.getByID(data[key].id))
      } else {
        await eachRecursive(data, ctx)
      }
    }
  }))
}

const eachRecursive = async function getDocsRecurr (obj, ctx) {
  for (var key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const item = obj[key]

      // If current object isn't a reference
      if (!item || item.isBroken === undefined) {
        eachRecursive(obj[key], ctx)
        continue
      }

      // Make sure type ends with _ref
      let type = item.type.replace('_ref', '') + '_ref'

      if (!ctx.state.linkedDocuments[type]) ctx.state.linkedDocuments[type] = new Map()
      ctx.state.linkedDocuments[type].set(item.id, await ctx.prismic.getByID(item.id))
    }
  }
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
        orderings: '[my.page.title]'
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
