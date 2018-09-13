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
const Slices = require('../components/slices')
const Subnavigation = require('../components/subnavigation')

module.exports = function listpage (state, ctx) {
  var uid = state.uid
  var doc = state.pages.items.find(doc => doc.type === 'listpage' && doc.uid === uid)
  var workDocs = state[state.docType === 'book' ? 'books' : 'movies']
  var workFilter = state.ui.workFilter

  return html`
    <body>
      <div class="Page">
      ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
      ${Section(Subnavigation(state, ctx))}
      <div class='Text Text--intro'>
        ${Section(asElement(doc.data.title, linkResolver, serializer()))}
      </div>
      ${doc.data.body && doc.data.body.length ? Slices(state, [doc.data.body[0]], (html) => Section({ body: html, push: true })) : ''}
      ${Section({
        isNarrow: false,
        body: Filter(Object.assign({
          formAction: ctx.request.url.split('?')[0],
          requestQuery: state.requestQuery,
          documents: workDocs
        }, workFilter))
      })}
      ${Section(Worklist({
        docType: state.docType,
        documents: workDocs,
        viewBy: workFilter.viewBy,
        emptyView: workFilter.empty
      }))}
      ${ContactInfo(state.linkedDocuments.contact_info_ref)}
      ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
  `
}
