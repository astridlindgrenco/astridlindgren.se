const y18n = require('y18n')

/**
 * Include locales in browser build
 */

const LANGUAGES = {
  de: require('./de'),
  en: require('./en'),
  sv: require('./sv')
}

const LANGUAGE_MAP = {
  de: 'de-de',
  en: 'en-gb',
  sv: 'sv-se'
}

const options = {
  directory: __dirname,
  locale: process.env.AL_LANG || 'sv'
}

const my18n = module.exports = y18n(options)

/**
 * Expose languages on instance
 */

my18n.languages = LANGUAGES

/**
 * Map language short code to proper (Prismic friendly) ISO format
 * @param {string} lang Language short code
 */

my18n.getCode = function (lang) {
  return LANGUAGE_MAP[lang]
}

/**
 * Get short code for language code
 * @param {string} code Language code
 */

my18n.getShortCode = function (code) {
  return Object.keys(LANGUAGE_MAP).find(key => LANGUAGE_MAP[key] === code)
}

my18n.getLocales = function () {
  return {
    home: my18n.__('Home'),
    language: my18n.__('Language'),
    search: my18n.__('Search'),
    searchbox: my18n.__('Searchbox')
  }
}
