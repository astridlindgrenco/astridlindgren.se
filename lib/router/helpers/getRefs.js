const getRefs = async (doc, ctx) => {
  let data = doc.data

  if (!ctx.state.linkedDocuments) ctx.state.linkedDocuments = {}
  if (!data) return

  await Promise.all(Object.keys(data).map(async (key, index) => {
    const item = data[key]

    if (item !== undefined && item !== null && item.isBroken !== undefined) {
      if (!ctx.state.linkedDocuments[key]) ctx.state.linkedDocuments[key] = new Map()

      ctx.state.linkedDocuments[key].set(item.id, await ctx.prismic.getByID(item.id))
    }
  }))
}

module.exports = getRefs
