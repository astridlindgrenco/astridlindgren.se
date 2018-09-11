const html = require('nanohtml')
const { __, getLocales } = require('../locale')
const linkResolver = require('../resolve')
const serializer = require('../components/text/serializer')
const asElement = require('prismic-element')
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
        isExpandable: false,
        toggleLabel: {
          show: __('Show filter'),
          hide: __('Hide filter')
        },
        body: Filter(Object.assign({
          formAction: '',
          requestQuery: state.requestQuery,
          documents: state.books
        }, bookFilter))
      })}
      ${Section(Booklist(state.books, bookFilter.viewBy))}
      ${ContactInfo(state.linkedDocuments.contact_info_ref)}
      ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
  `
}
