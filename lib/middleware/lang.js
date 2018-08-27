'use strict'

/**
 * Determine language according to:
 * 1. URL path element.
 * 2. IP-lookup. TODO
 * 3. Cookie.
 * 4. Deafult site language.
 */

const { __, setLocale, getLang } = require('../locale')

module.exports = async function lang (ctx, next) {
  // check if language is part of url e.g. /en/page-about-something
  let urlLangCodeRe = /^\/(\w\w)($|\/)/
  let urlLangCode = urlLangCodeRe.exec(ctx.req.url)
  if (urlLangCode) {
    ctx.state.lang = getLang(urlLangCode[1])
    console.log('set ctx.state.lang', ctx.state.lang)
    ctx.cookies.set('lang', ctx.state.lang)
  } else {
    // check cookie
    let lang = ctx.cookies.get('lang')
    if (lang && lang.length === 5) {
      ctx.state.lang = lang
    } else {
      // else use default language (already set in ctx.state.lang)
      console.log('use ctx.state.lang', ctx.state.lang)
      ctx.cookies.set('lang', ctx.state.lang)
    }
  }
  setLocale(ctx.state.lang)
  // change localization messages used in header
  ctx.state.locales = {
    home: __('Home'),
    language: __('Language'),
    search: __('Search'),
    searchbox: __('Searchbox'),
    show_more: __('Show more'),
    show_less: __('Show less')
  }
  return next()
}
