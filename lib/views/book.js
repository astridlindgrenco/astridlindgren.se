const html = require('nanohtml')
const Section = require('../components/section')
const Header = require('../components/header')
const ContactInfo = require('../components/contact_info')
const Footer = require('../components/footer')
const { __, getLocales } = require('../locale')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const {linkResolver} = require('../resolve')
const serializer = require('../components/text/serializer')
const DefinitionList = require('../components/definitionlist')
const SubNavigation = require('../components/subnavigation')
const { image } = require('../components/base/utils')

/**
 * TODO - Finalize. This a just quick mockup for a book page.
 * @param {} state
 */
module.exports = (state, ctx) => {
  var doc = state.pages.items.find(doc => doc.type === 'book')
  var cover = image(doc.data.cover, ['qw-small', 'qw-medium', 'qw-large', 'qw-xlarge'])
  return html`
    <body>
      <div class="Page">
      ${Section(Header(state.navDocument, state.ui.header, getLocales(), state.locale))}
      ${Section(SubNavigation(state, doc.id))}
      ${Section({
        push: true,
        isNarrow: true,
        body: html`
          <div class="Grid Grid--withGutter">
            <div class="Grid-cell u-md-size1of4 u-lg-size1of3">
              <img class="Image"
                   src="${cover.src}"
                   alt="${cover.alt}"
                   title="${doc.data.cover.copyright}"
                srcset="${cover.srcset}"
                 sizes="${cover.sizes}">
            </div>
            <div class="Grid-cell u-md-size3of4 u-lg-size2of3">
              <div class="Text Text--left">
                ${asElement(doc.data.book_title, linkResolver, serializer({
                  classes: {
                    heading1: { 'Text-h2': true }
                  }
                }))}
                <p class="Text-small">${doc.data.author_year}</p>
              </div>
              ${DefinitionList(Object.entries(doc.data).map(function createDefList ([apiID, data]) {
                if (!data) return
                switch (apiID) {
                  case 'authors':
                    return [__('Author'), typeof data === 'string' ? data : asText(data)]
                  case 'illustrators':
                    return [__('Illustrator'), typeof data === 'string' ? data : asText(data)]
                  case 'publicist':
                    return [__('Publisher'), typeof data === 'string' ? data : asText(data)]
                  case 'type':
                    return [__('Booktype'), __(typeof data === 'string' ? data : asText(data))]
                  case 'editors':
                    return [__('Editors'), typeof data === 'string' ? data : asText(data)]
                  case 'translators':
                    return [__('Translators'), typeof data === 'string' ? data : asText(data)]
                  case 'photograpers':
                    return [__('Photograpers'), typeof data === 'string' ? data : asText(data)]
                  case 'isbn':
                    return [__('isbn'), typeof data === 'string' ? data : asText(data)]
                  case 'book_title':
                  case 'quote':
                  case 'abstract':
                  default:
                    break
                }
              }).filter(Boolean))}
              <div class="Text Text--smaller">
                ${asElement(doc.data.abstract, linkResolver, serializer())}
              </div>
              <!--br/><a href="${__('booklist')}">Visa alla böcker</a-->
            </div>
          </div>
        `
      })}
      ${ContactInfo(state.linkedDocuments.contact_info_ref, (!doc.data.body.length && doc.data.main_body.length))}
      ${Footer(state.linkedDocuments.footer_ref, ctx)}
      </div>
    </body>
  `
}
