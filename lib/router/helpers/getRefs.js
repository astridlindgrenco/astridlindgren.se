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

async function eachRecursive (obj, ctx) {
  for (var k in obj) {
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      const item = obj[k]

      if (!item || item.isBroken === undefined) {
        eachRecursive(obj[k], ctx)
        continue
      }

      let type = item.type + '_ref'
      if (!ctx.state.linkedDocuments[type]) ctx.state.linkedDocuments[type] = new Map()
      ctx.state.linkedDocuments[type].set(item.id, await ctx.prismic.getByID(item.id))
    }
  }
}
