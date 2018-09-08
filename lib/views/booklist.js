const html = require('nanohtml')
const { getLocales } = require('../locale')
const linkResolver = require('../resolve')
const serializer = require('../components/text/serializer')
const { asText } = require('prismic-richtext')
const asElement = require('prismic-element')
const Section = require('../components/section')
const Header = require('../components/header')
const ContactInfo = require('../components/contact_info')
const Footer = require('../components/footer')
const Booklist = require('../components/booklist')
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
 * @param  {Array} options Possible filter options retrieved from booklist document
 * @param  {Array} books   Book documents
 * @return {Array}         Controls for filter view
 */
function buildFilterControls (options, books) {
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
      options: getOptions(books, api_id), // Get the prop from all the books
      defaultOption: default_option,
      resetLabel: reset_label
    }
  })
}

/**
 * Creates all options needed by filter view
 * @param  {Array} books Array of book documents
 * @param  {String} apiId Field API ID
 * @return {Array}       An array of options
 */
function getOptions (books, apiId) {
  var pairs = books.map(getOption(apiId)).filter(Boolean)
  var uniqueValues = new Map(pairs)
  var uniquePairs = Array.from(uniqueValues)
  return uniquePairs
         .map(function pairsToObj ([label, value]) {
           return {label, value}
         })
}

/**
 * Create a mapper function based on a property
 * @param  {String} apiID Field API ID
 * @return {Function}     A mapper function that expects a book document type
 */
function getOption (apiID) {
  /**
   * Mapper function that gets values for option based on book document for view
   * @param  {Object} book A book document
   * @return {Array}      Key/value pair array of [label of option]/[value for option]
   */
  return function getValueFromBook (book) {
    var bookValue = book.data[apiID]
    if (!bookValue) return
    if (typeof bookValue === 'string') {
      // Simple value, key text, select etc
      return [bookValue, bookValue]
    } else if (bookValue.link_type && bookValue.id && !bookValue.isBroken) {
      // Document link
      // TODO: get link document title
      return [bookValue.uid, bookValue.id]
    } else if (Array.isArray(bookValue)) {
      // Structured text
      return [asText(bookValue), asText(bookValue)]
    }
  }
}
