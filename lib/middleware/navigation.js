'use strict'

/**
 * Get navigation docuent according to language.
 */

module.exports = async function navigation (ctx, next) {
  const options = { lang: ctx.state.lang }
  // console.log('[Middleware->Navigation] lang:', ctx.state.lang)
  ctx.state.navDocument = await ctx.prismic.getSingle('navigation', options)
  ctx.assert(ctx.state.navDocument, 500, 'Content missing')
  return next()
}
