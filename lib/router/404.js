'use strict'

const getRefs = require('./helpers/getRefs')
const getMetadata = require('./helpers/getMetadata')

module.exports = async function err404Router (ctx, next) {
  const options = { lang: ctx.state.lang }
  const doc = await ctx.prismic.getSingle('404', options)
  ctx.assert(doc, 500, 'Content missing')
  ctx.state.pages.items = []
  ctx.state.pages.items.push(doc)
  ctx.state.title = doc.data.title[0].text

  await getRefs(doc.data, ctx)
  await getMetadata(doc, ctx, next)
}
