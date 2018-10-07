'use strict'

/**
 * Determine locale according to:
 * 1. URL path element (url == /locale/*).
 * 2. IP-lookup (url == /). TODO
 * 3. Cookie (url == /).
 * 4. Deafult site language (url == /).
 * This middleware should intercepts the request before any route
 * and by that always have ctx.state.lang and locale set.
 */

const { __, setLocale, getLang } = require('../locale')
const urlLocalePattern = /^\/(\w\w)((_|-)\w\w)?($|\/)/

module.exports = async function lang (ctx, next) {
  // 1. Check the URL
  const locale = urlLocalePattern.exec(ctx.url)
  if (locale) {
    ctx.state.lang = getLang(locale[1])
    ctx.cookies.set('lang', ctx.state.lang)
  } else {
    // 3. Check the cookie
    const langCookie = ctx.cookies.get('lang')
    if (langCookie && langCookie.length === 5) {
      ctx.state.lang = langCookie
    } else {
      // 4. Use default language (already set in ctx.state.lang)
      ctx.cookies.set('lang', ctx.state.lang)
    }
  }

  ctx.state.locale = ctx.state.lang.substring(0, 2)
  setLocale(ctx.state.locale)

  // change localization messages used in header
  ctx.state.locales = {
    home: __('Home'),
    homeTitle: __('Home title'),
    language: __('Language'),
    search: __('Search'),
    searchbox: __('Searchbox'),
    show_more: __('Show more'),
    show_less: __('Show less')
  }
  return next()
}
