var html = require('nanohtml')
var Section = require('../components/section')
var Header = require('../components/header')
var Hero = require('../components/hero')
var Slices = require('../components/slices')
var serialize = require('../components/text/serialize')
var linkResolver = require('../resolve')
var asElement = require('prismic-element')
var { asText } = require('prismic-richtext')

module.exports = function home (state) {
  var doc = state.pages.items.find(doc => doc.type === 'home')
  return html`
    <body>
      <div class="Page">
        ${Section(Header(state.navDocument, state.ui.header))}
        ${Section(Hero(doc.data.hero_image))}
        ${Section({
          pushLarge: true,
          body: html`
            <div class="Text${doc.data.theme_center_first_para === 'Ja' ? ' u-textCenter' : ''}">
              ${asElement(doc.data.title, linkResolver, serialize)}
              ${asElement(doc.data.main_body, linkResolver, serialize)}
            </div>
          `})
        }
        ${Slices(doc.data.body, (html) => Section({ body: html, push: true }))}
      </div>
    </body>
  `
}
