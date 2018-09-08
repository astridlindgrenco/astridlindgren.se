const html = require('nanohtml')
const { getLocales } = require('../locale')
const linkResolver = require('../resolve')
const serializer = require('../components/text/serializer')
const { asText } = require('prismic-richtext')
const asElement = require('prismic-element')
const { pipe } = require('../components/base/utils')
const Section = require('../components/section')
const Header = require('../components/header')
const ContactInfo = require('../components/contact_info')
const Footer = require('../components/footer')
const Booklist = require('../components/booklist')
const asElement = require('prismic-element')
const linkResolver = require('../resolve')
const serializer = require('../components/text/serializer')
const Sorting = require('../components/sorting')
const Filter = require('../components/filter')
const Subnavigation = require('../components/subnavigation')

module.exports = function booklist (state, ctx) {
  var doc = state.pages.items.find(doc => doc.type === 'booklist')
  var bookFilter = state.ui.bookFilter
  return html`
    <body>
      <div class="Page">
      ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
      ${Section(Subnavigation(state, ctx))}
      <div class='Text Text--intro'>
        ${Section(asElement(doc.data.title, linkResolver, serializer()))}
      </div>
      ${Section({
        isNarrow: false,
        body: Filter({
          action: '',
          activeFilter: state.requestQuery,
          filters: buildFilterControls(bookFilter.options, state.books)
        })
      })}
      ${Section(Booklist(state.books, state.viewBy))}
      ${ContactInfo(state.linkedDocuments.contact_info_ref)}
      ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
  `
}

/**
 * Creates option control objects for filter view
 * @param  {Array} options Possible filter options retrieved from list view document
 * @param  {Array} documents Prismic documents
 * @return {Array}         Controls for filter view
 */
function buildFilterControls (options, documents) {
  // Prepare an array of empty objects with api ID as key
  return options.map(function createControl ({
      label,
      api_id,
      default_option,
      reset_label
    }) {
    return {
      label,
      name: api_id,
      options: getOptions(documents, api_id), // Get the prop from all the books
      defaultOption: default_option,
      resetLabel: reset_label
    }
  })
}

/**
 * Creates all options needed by filter view
 * @param  {Array} docs Array of Prismic documents
 * @param  {String} apiId Field API ID
 * @return {Array}       An array of options
 */
function getOptions (docs, apiId) {
  var options = docs.map(doc => getControlOptions(doc, apiId)).filter(Boolean)
  var flatUniquePairs = pipe(flattenToPairs, uniquePairs)
  return flatUniquePairs(options)
         .map(function pairsToObj ([label, value]) {
           return {label, value}
         })
}

/**
 * Gets all values for option based on Prismic document
 * @param  {Object} doc A Prismic document
 * @param  {String} apiID Field API ID
 * @return {Array}        Key/value pair array of [label of option]/[value for option]
 */
function getControlOptions (doc, apiID) {
  var prop = apiID === 'tags' ? doc[apiID] : doc.data[apiID]
  return getControlOption(prop)
}

/**
 * Create label/value pair property for use with a filter control
 * @param  {Mixed} prop String, array, object, etc
 * @return {Array}      An key/value pair array OR an array of key/value pair arrays
 */
function getControlOption (prop) {
  if (!prop) return
  if (typeof prop === 'string') {
    if (prop.indexOf(',') !== -1) {
      // Comma separated list, do recursive call
      return prop.split(',').map(str => getControlOption(str.trim()))
    } else {
      // Simple value, key text, select
      return [prop, prop]
    }
  } else if (prop.link_type && prop.id && !prop.isBroken) {
    // Document link
    // TODO: get link document title
    return [prop.uid, prop.id]
  } else if (Array.isArray(prop)) {
    if (prop[0].text) {
      // Structured text
      return [asText(prop), asText(prop)]
    } else {
      // Tags or something, do recursive call
      return prop.map(getControlOption)
    }
  }
}

/**
 * Takes an array with up to 3 levels and recuces it to pairs
 * Example: [[1,2], [4,6], [[[10,11], [12,13]]]] becomes [[1,2], [4,6], [10,11], [12,13]]
 * @param  {Array} arrays An array of arrays with varying dephts
 * @return {Array}        An array with key/value pair arrays
 */
function flattenToPairs (arrays) {
  return arrays.reduce(function (acc, currValue) {
    return Array.isArray(currValue[0]) ? acc.concat(currValue) : acc.concat([currValue])
  }, [])
}

/**
 * Converts an array of pairs to only unique pairs
 * @param  {Array} pairsArray Array of key/value pair arrays
 * @return {Array}           The same array but with unique values
 */
function uniquePairs (pairsArray) {
  return Array.from(new Map(pairsArray))
}
