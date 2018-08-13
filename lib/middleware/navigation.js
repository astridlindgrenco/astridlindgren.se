'use strict'

/**
 * Get navigation docuent according to language.
 */

const locale = require('../locale')

module.exports = async function navigation (ctx, next) {
  const langCode = locale.getCode(ctx.state.lang)
  const options = { lang: langCode }
  ctx.state.navDocument = await ctx.prismic.getSingle('navigation', options)
  ctx.assert(ctx.state.navDocument, 500, 'Content missing')
  return next()
}