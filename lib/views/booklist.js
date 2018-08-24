const html = require('nanohtml')
const Section = require('../components/section')
const Header = require('../components/header')
const ContactInfo = require('../components/contact_info')
const Footer = require('../components/footer')
const { getLocales } = require('../locale')
const Booklist = require('../components/booklist')
const asElement = require('prismic-element')
const linkResolver = require('../resolve')
const serializer = require('../components/text/serializer')

module.exports = function newsroom (state) {
  var doc = state.pages.items.find(doc => doc.type === 'booklist')
  return html`
    <body>
      <div class="Page">
      ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
      <div class="Text Text--intro">
        ${Section(asElement(doc.data.title, linkResolver, serializer()))}
      </div>
      ${Section(Booklist(state.books, doc))}
      ${ContactInfo(state.linkedDocuments.contact_info_ref)}
      ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
  `
}
