'use strict'

/**
 * Determine locale according to:
 * 1. First path element in the URL.
 * 2. Deafult site language.
 * This middleware should intercepts the request before any route
 * and by that always have ctx.state.lang and locale set.
 */

const { __, setLocale, getLang } = require('../locale')
const urlLocalePattern = /^\/(\w\w)((_|-)\w\w)?($|\/)/

module.exports = async function lang (ctx, next) {
  const locale = urlLocalePattern.exec(ctx.url)
  if (locale) {
    ctx.state.lang = getLang(locale[1])
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
