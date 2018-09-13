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

module.exports = function listpage (state, ctx) {
  var uid = state.uid
  var doc = state.pages.items.find(doc => doc.type === 'listpage' && doc.uid === uid)
  var workDocs = state[state.docType === 'book' ? 'books' : 'movies']
  var workFilter = state.ui.workFilter

  // Create view configuration for Worklist component
  var workListOptions = {
    propHandlers: {},
    workDetails: []
  }
  if (state.docType === 'book') {
    workListOptions.propHandlers = {
      title: (doc) => doc.data.book_title,
      year: (doc) => doc.data.author_year,
      uid: (doc) => `/${doc.lang}/${__('book')}/${doc.uid}`
    }
    workListOptions.workDetails = [
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
    ]
  } else if (state.docType === 'movie') {
    workListOptions.propHandlers = {
      title: (doc) => doc.data.movie_title,
      year: (doc) => doc.data.published_year,
      uid: (doc) => `/${doc.lang}/${__('movie')}/${doc.uid}`
    }
    workListOptions.workDetails = [
      {
        label: __('Director'),
        prop: 'director'
      }
    ]
  }
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
          formAction: ctx.request.url.split('?')[0],
          requestQuery: state.requestQuery,
          documents: workDocs
        }, workFilter))
      })}
      ${Section(Worklist({
        documents: workDocs,
        propHandlers: workListOptions.propHandlers,
        workDetails: workListOptions.workDetails,
        viewBy: workFilter.viewBy,
        emptyView: workFilter.empty
      }))}
      ${ContactInfo(state.linkedDocuments.contact_info_ref)}
      ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
  `
}
