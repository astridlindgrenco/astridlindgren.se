'use strict'

/**
 * Render of the page type 'page'.
 */

var html = require('nanohtml')
var asElement = require('prismic-element')
var linkResolver = require('../resolve')
var { getLocales } = require('../locale')
var Section = require('../components/section')
var Header = require('../components/header')
var Slices = require('../components/slices')
var Hero = require('../components/hero')
const ContactInfo = require('../components/contact_info')
const Footer = require('../components/footer')
var serializer = require('../components/text/serializer')
var Subnavigation = require('../components/subnavigation')

module.exports = function page (state) {
  const uid = (state.params.sub_path || state.params.path)
  const doc = state.pages.items.find(item => item.uid === uid)
  return html`
    <body>
      <div class="Page">
        ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
        ${Section(Subnavigation(state))}
        ${Section(Hero(doc.data.hero_image))}
        ${Section({
          isExpandable: doc.data.theme_collapse_main_body === 'Ja',
          push: true,
          isNarrow: true,
          body: html`
            <div class="Text Text--intro">
              ${asElement(doc.data.title, linkResolver, serializer())}
              ${asElement(doc.data.intro, linkResolver, serializer())}
            </div>
            <div class="Text Text--article">
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
