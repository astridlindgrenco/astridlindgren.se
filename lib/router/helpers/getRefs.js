module.exports = async (data, ctx) => {
  if (!ctx.state.linkedDocuments) ctx.state.linkedDocuments = {}

  await Promise.all(Object.keys(data).map(async (key, index) => {
    if (data[key] && data[key].isBroken !== undefined) {
      if (!ctx.state.linkedDocuments[key]) ctx.state.linkedDocuments[key] = new Map()

      ctx.state.linkedDocuments[key].set(data[key].id, await ctx.prismic.getByID(data[key].id))
    }
  }))
}
