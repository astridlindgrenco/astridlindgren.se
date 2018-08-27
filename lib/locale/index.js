const y18n = require('y18n')

/**
 * Include locales in browser build
 */

const LANGUAGES = {
  de: require('./de-de'),
  en: require('./en-gb'),
  sv: require('./sv-se')
}

const LOCALES = {
  de: 'de-de',
  en: 'en-gb',
  sv: 'sv-se'
}

const options = {
  directory: __dirname,
  locale: process.env.AL_LANG || 'sv-se'
}

const my18n = module.exports = y18n(options)

/**
 * Expose languages on instance
 */

my18n.languages = LANGUAGES

/**
 * Map language short code to a ISO locale (Prismic 'lang').
 * @param {string} lang Language short code
 */

my18n.getLang = function (langCode) {
  return LOCALES[langCode]
}

/**
 * Get short code for language code
 * @param {string} code Language code
 */

my18n.getShortCode = function (code) {
  return Object.keys(LOCALES).find(key => LOCALES[key] === code)
}

my18n.getLocales = function () {
  return {
    home: my18n.__('Home'),
    language: my18n.__('Language'),
    search: my18n.__('Search'),
    searchbox: my18n.__('Searchbox'),
    show_more: my18n.__('Show more'),
    show_less: my18n.__('Show less')
  }
}
