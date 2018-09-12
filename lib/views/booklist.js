const html = require('nanohtml')
const { __, getLocales } = require('../locale')
const linkResolver = require('../resolve')
const serializer = require('../components/text/serializer')
const asElement = require('prismic-element')
const Section = require('../components/section')
const Header = require('../components/header')
const ContactInfo = require('../components/contact_info')
const Footer = require('../components/footer')
const Worklist = require('../components/worklist')
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
        body: Filter(Object.assign({
          formAction: '',
          requestQuery: state.requestQuery,
          documents: state.books
        }, bookFilter))
      })}
      ${Section(Worklist({
        documents: state.books,
        propHandlers: {
          title: (doc) => doc.data.book_title,
          year: (doc) => doc.data.author_year
        },
        workDetails: [
          {
            label: __('Author'),
            prop: 'authors',
            blacklist: ['Astrid Lindgren']
          },
          {
            label: __('Illustrator'),
            prop: 'illustrators'
          },
          {
            label: __('Photograpers'),
            prop: 'photograpers'
          }
        ],
        viewBy: bookFilter.viewBy,
        emptyView: bookFilter.empty
      }))}
      ${ContactInfo(state.linkedDocuments.contact_info_ref)}
      ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
  `
}
