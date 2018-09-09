const html = require('nanohtml')
const { getLocales } = require('../locale')
const linkResolver = require('../resolve')
const serializer = require('../components/text/serializer')
const asElement = require('prismic-element')
const Section = require('../components/section')
const Header = require('../components/header')
const ContactInfo = require('../components/contact_info')
const Footer = require('../components/footer')
const SortingAndFilter = require('../components/booklist/SortingAndFilter')
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
          formAction: '',
          requestQuery: state.requestQuery,
          filters: bookFilter.options,
          documents: state.books
        })
      })}
      ${Section(SortingAndFilter(bookFilter.viewBy, bookFilter.sortBy))}
      ${Section(Booklist(state.books, bookFilter.viewBy))}
      ${ContactInfo(state.linkedDocuments.contact_info_ref)}
      ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
  `
}
