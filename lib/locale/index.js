const y18n = require('y18n')

const my18n = module.exports = y18n({
  directory: __dirname,
  locale: 'sv',
  updateFiles: false
})

my18n.languages = {
  'de': require('./de'),
  'en': require('./en'),
  'sv': require('./sv')
}

/**
 * Return the Prismic lang code (lc-cc) for the corresponding locale code (lc).
 * @param {string} code Locale code
 */
my18n.getLang = function (locale) {
  switch (locale) {
    case 'de':
      return 'de-de'
    case 'en':
      return 'en-gb'
    case 'sv':
    default:
      return 'sv-se'
  }
}

my18n.getLocales = function () {
  return {
    home: my18n.__('Home'),
    language: my18n.__('Language'),
    search: my18n.__('Search'),
    searchbox: my18n.__('Searchbox'),
    show_more: my18n.__('Show more'),
    show_less: my18n.__('Show less'),
    show_all: my18n.__('Show all')
  }
}
