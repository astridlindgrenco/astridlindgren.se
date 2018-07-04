const y18n = require('y18n')

/**
 * Include locales in browser build
 */

const LANGUAGES = {
  en: require('./en'),
  ru: require('./ru'),
  sv: require('./sv')
}

const LANGUAGE_MAP = {
  en: 'en-us',
  ru: 'ru',
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
