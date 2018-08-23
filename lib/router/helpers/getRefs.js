module.exports = async (data, ctx) => {
  if (!ctx.state.linkedDocuments) ctx.state.linkedDocuments = {}

  await Promise.all(Object.keys(data).map(async (key, index) => {
    const item = data[key]

    if (item && item.isBroken !== undefined) {
      if (!ctx.state.linkedDocuments[key]) ctx.state.linkedDocuments[key] = new Map()

      ctx.state.linkedDocuments[key].set(item.id, await ctx.prismic.getByID(item.id))
    }
  }))
}
