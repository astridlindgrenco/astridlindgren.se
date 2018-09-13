const html = require('nanohtml')
const { __, getLocales } = require('../locale')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const linkResolver = require('../resolve')
const serializer = require('../components/text/serializer')
const Section = require('../components/section')
const Header = require('../components/header')
const ContactInfo = require('../components/contact_info')
const Footer = require('../components/footer')
const DefinitionList = require('../components/definitionlist')
const { image } = require('../components/base/utils')

/**
 * TODO - Finalize. This a just quick mockup for a movie page.
 * @param {} state
 */
module.exports = function movie (state) {
  var doc = state.pages.items.find(doc => doc.type === 'movie')
  var cover = image(doc.data.cover, ['qw-small', 'qw-medium', 'qw-large', 'qw-xlarge'])
  return html`
    <body>
      <div class="Page">
      ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
      ${Section({
        push: true,
        isNarrow: true,
        body: html`
          <div class="Grid Grid--withGutter">
            <div class="Grid-cell u-md-size1of4 u-lg-size1of3">
              <img class="Image"
                   src="${cover.src}"
                   alt="${cover.alt}"
                srcset="${cover.srcset}"
                 sizes="${cover.sizes}">
            </div>
            <div class="Grid-cell u-md-size3of4 u-lg-size2of3">
              <div class="Text Text--left">
                ${asElement(doc.data.movie_title, linkResolver, serializer({
                  classes: {
                    heading1: { 'Text-h2': true }
                  }
                }))}
                <p class="Text-small">${doc.data.published_year}</p>
              </div>
              ${DefinitionList(Object.entries(doc.data).map(function createDefList ([apiID, data]) {
                switch (apiID) {
                  case 'directors':
                    return [__('Director'), typeof data === 'string' ? data : asText(data)]
                  default:
                    break
                }
              }).filter(Boolean))}
              <div class="Text Text--smaller">
                ${asElement(doc.data.abstract, linkResolver, serializer())}
              </div>
            </div>
          </div>
        `
      })}
      ${ContactInfo(state.linkedDocuments.contact_info_ref)}
      ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
  `
}
