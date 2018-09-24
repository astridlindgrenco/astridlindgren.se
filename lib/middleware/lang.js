'use strict'

/**
 * Determine locale according to:
 * 1. URL path element.
 * 2. IP-lookup. TODO
 * 3. Cookie.
 * 4. Deafult site language.
 * This middleware should intercepts the request before any route
 * and by that always have ctx.state.lang and locale set.
 */

const { __, setLocale, getLang } = require('../locale')

module.exports = async function lang (ctx, next) {
  // 1. Check the URL
  let urlLocalePattern = /^\/(\w\w)((_|-)\w\w)?($|\/)/
  let locale = urlLocalePattern.exec(ctx.req.url)
  if (locale) {
    ctx.state.lang = getLang(locale[1])
    ctx.cookies.set('lang', ctx.state.lang)
  } else {
    // 3. Check the cookie
    let lang = ctx.cookies.get('lang')
    if (lang && lang.length === 5) {
      ctx.state.lang = lang
    } else {
      // 4. Use default language (already set in ctx.state.lang)
      ctx.cookies.set('lang', ctx.state.lang)
    }
  }

  ctx.state.locale = ctx.state.lang.substring(0, 2)
  setLocale(ctx.state.locale)
  console.log(`[Middleware->Lang] set lang to '${ctx.state.lang}' for locale '${ctx.state.locale}'`)

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
