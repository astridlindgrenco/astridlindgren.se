'use strict'

/**
 * Determine language according to:
 * 1. URL path element.
 * 2. IP-lookup. TODO
 * 3. Cookie.
 * 4. Deafult site language.
 */

const locale = require('../locale')

module.exports = async function lang (ctx, next) {
  // check if language is part of url e.g. /en/page-about-something
  let urlLangRe = /^\/(\w\w)($|\/)/
  let urlLang = urlLangRe.exec(ctx.req.url)
  if (urlLang) {
    ctx.state.lang = urlLang[1]
  } else {
    // check cookie
    let lang = ctx.cookies.get('lang')
    if (lang > '') {
      ctx.state.lang = lang
    }
  }
  // else use default language (already set in ctx.state.lang)
  ctx.cookies.set('lang', ctx.state.lang)
  return next()
}
