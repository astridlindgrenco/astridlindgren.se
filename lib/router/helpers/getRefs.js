
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
module.exports = async (data, ctx) => {
  if (!ctx.state.linkedDocuments) ctx.state.linkedDocuments = {}

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

const eachRecursive = async (obj, ctx) => {
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
