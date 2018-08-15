var html = require('nanohtml')
var raw = require('nanohtml/raw')
var Section = require('../components/section')
var Header = require('../components/header')
var DOM = require('prismic-dom')
var linkResolver = require('../resolve')
var { asText } = require('prismic-richtext')
const { getLocales } = require('../locale')

module.exports = function home (state) {
  var doc = state.pages.items[0]
  return html`
    <body>
      <div class="Page">
        ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
        ${Section(html`<h1>${asText(doc.data.title)}</h1>`)}
        ${Section(asImg(doc.data.image))}
        ${Section(raw(DOM.RichText.asHtml(doc.data.body, linkResolver)))}
        </div>
    </body>
  `
}

function asImg (image) {
  if (!image.url) return ''
  return html`
  <img src='${html(image.url)}'
     width='${image.dimensions.width}px'
    height='${image.dimensions.height}px'
       alt='${image.dimensions.alt || '404'}'>
  `
}
