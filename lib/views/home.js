const html = require('nanohtml')
const Section = require('../components/section')
const Header = require('../components/header')
const Hero = require('../components/hero')
const ContactInfo = require('../components/contact_info')
const Footer = require('../components/footer')
const Slices = require('../components/slices')
const serializer = require('../components/text/serializer')
const {linkResolver} = require('../resolve')
const asElement = require('prismic-element')
const { getLocales, getAlternateLanguagePaths } = require('../locale')

module.exports = function home (state, ctx) {
  const doc = state.pages.items.find(doc => doc.type === 'home')
  if (!doc) return ''
  state.langs = getAlternateLanguagePaths(doc.alternate_languages)

  return html`
    <body>
      <div class="Page">
        ${Section(Header(state.navDocument, state.ui.header, getLocales(), state.locale, state.langs))}
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
            push: false,
            isNarrow: true,
            body: html`
              <div class="Text">
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
        ${ContactInfo(state.linkedDocuments.contact_info_ref, (!doc.data.body.length && doc.data.main_body.length))}
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
