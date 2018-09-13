const html = require('nanohtml')
const Section = require('../components/section')
const Header = require('../components/header')
const ContactInfo = require('../components/contact_info')
const Footer = require('../components/footer')
const { getLocales } = require('../locale')
const asElement = require('prismic-element')
const linkResolver = require('../resolve')
const serializer = require('../components/text/serializer')

/**
 * TODO - Finalize. This a just quick mockup for a movie page.
 * @param {} state
 */
module.exports = function movie (state) {
  var doc = state.pages.items.find(doc => doc.type === 'movie')
  return html`
    <body>
      <div class="Page">
      ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
      <div class="Text Text--intro">
        ${Section(asElement(doc.data.movie_title, linkResolver, serializer()))}
      </div>
      ${Section(html`<div style="text-align: center"><img src="${doc.data.cover.url}" alt="${doc.data.cover.url}"></div>`)}
      <div class="Text Text--intro">
        ${Section(asElement(doc.data.abstract, linkResolver, serializer()))}
      </div>
      ${ContactInfo(state.linkedDocuments.contact_info_ref)}
      ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
  `
}
