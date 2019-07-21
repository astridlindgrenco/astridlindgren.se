'use strict'

module.exports = async function err404Router (ctx, next) {
  if (ctx.view) return next()
  console.log('[404]', ctx.url)
  const options = { lang: ctx.state.lang }
  const doc = await ctx.prismic.getSingle('404', options)
  ctx.assert(doc, 500, 'Content missing')
  ctx.view = '404'
  ctx.state.doc = doc
  ctx.state.title = doc.data.title[0].text

  return next()
}
