var html = require('nanohtml')
var Section = require('../components/section')
var Header = require('../components/header')
var Hero = require('../components/hero')
const ContactInfo = require('../components/contact_info')
const Footer = require('../components/footer')
var Slices = require('../components/slices')
var serializer = require('../components/text/serializer')
var linkResolver = require('../resolve')
var asElement = require('prismic-element')
const { getLocales } = require('../locale')

module.exports = function home (state, ctx) {
  var doc = state.pages.items.find(doc => doc.type === 'home')
  if (!doc) return ''
  var hasCollasibleBody = doc.data.theme_collapse_main_body === 'Ja'
  return html`
    <body>
      <div class="Page">
        ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
        ${Section(Hero(doc.data.hero_image))}
        ${Section({
          push: false,
          isNarrow: true,
          body: html`
            <div class="Text Text--intro">
              ${asElement(doc.data.title, linkResolver, serializer())}
              ${asElement(doc.data.intro, linkResolver, serializer())}
            </div>
          `})
        }
        ${isValidText(doc.data.main_body)
          ? Section({
            isExpandable: hasCollasibleBody,
            push: !hasCollasibleBody,
            pullTop: hasCollasibleBody,
            isNarrow: true,
            body: html`
              <div class="Text Text--article">
                ${asElement(doc.data.main_body, linkResolver, serializer({
                  classes: {
                    heading2: { 'Text-h3': true }
                  }
                }))}
              </div>
            `})
          : null
        }
        ${Slices(state, doc.data.body, (html) => Section({ body: html, push: true }, ctx))}
        ${ContactInfo(state.linkedDocuments.contact_info_ref)}
        ${Footer(state.linkedDocuments.footer_ref, ctx)}
      </div>
    </body>
  `
}

/**
 * Checkes if a Prismic StructuredText object has actual text and not empty elments
 * @param  {Object}  structuredText A Prismic StructuredText object
 * @return {Boolean}                True if is has actual text (at least one character) false otherwise
 */
function isValidText (structuredText) {
  return structuredText.length && structuredText.every(element => element.text && element.text.length)
}
