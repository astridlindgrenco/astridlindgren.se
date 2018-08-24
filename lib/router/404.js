'use strict'

const locale = require('../locale')
const getRefs = require('./helpers/getRefs')

module.exports = async (ctx, next) => {
  const langCode = locale.getCode(ctx.state.lang)
  const options = { lang: langCode }
  const doc = await ctx.prismic.getSingle('404', options)
  await getRefs(doc.data, ctx)

  ctx.assert(doc, 500, 'Content missing')
  ctx.state.pages.items = []
  ctx.state.pages.items.push(doc)
  ctx.state.title = doc.data.title[0].text
}
