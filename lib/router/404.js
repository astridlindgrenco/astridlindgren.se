'use strict'

const getRefs = require('./helpers/getRefs')

module.exports = async (ctx, next) => {
  const options = { lang: ctx.state.lang }
  const doc = await ctx.prismic.getSingle('404', options)
  await getRefs(doc.data, ctx)

  ctx.assert(doc, 500, 'Content missing')
  ctx.state.pages.items = []
  ctx.state.pages.items.push(doc)
  ctx.state.title = doc.data.title[0].text
}
