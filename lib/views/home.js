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

  return html`
    <body>
      <div class="Page">
        ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
        ${Section(Hero(doc.data.hero_image))}
        ${Section({
          push: true,
          isNarrow: true,
          body: html`
            <div class="Text Text--intro">
              ${asElement(doc.data.title, linkResolver, serializer())}
              ${asElement(doc.data.intro, linkResolver, serializer())}
            </div>
            <div class="Text Text--article" aria-collapsible="${doc.data.theme_collapse_main_body === 'Ja'}">
              ${asElement(doc.data.main_body, linkResolver, serializer({
                classes: {
                  heading2: { 'Text-h3': true }
                }
              }))}
            </div>
          `})
        }
        ${Slices(state, doc.data.body, (html) => Section({ body: html, push: true }))}
        ${ContactInfo(state.linkedDocuments.contact_info_ref)}
        ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
  `
}
