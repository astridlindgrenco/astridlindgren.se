var html = require('nanohtml')
var raw = require('nanohtml/raw')
var Section = require('../components/section')
var Header = require('../components/header')
var ContactInfo = require('../components/contact_info')
var Footer = require('../components/footer')
var DOM = require('prismic-dom')
var {linkResolver} = require('../resolve')
var { asText } = require('prismic-richtext')
const { getLocales } = require('../locale')

module.exports = (state) => {
  var doc = state.pages.items[0]
  return html`
    <body>
      <div class="Page">
        ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
        ${Section(html`<h1></h1>`)}
        ${Section(html`
          <div class="ErrorSection">
            <div class="ErrorSection-content">
              <div class="ErrorSection-content-wrapper">
                <div>
                  <h1>${asText(doc.data.title)}</h1>
                  ${raw(DOM.RichText.asHtml(doc.data.body, linkResolver))}
                </div>
                <div>${Section(asImg(doc.data.image))}</div>
              </div>

              <script>console.error('${raw(JSON.stringify(state.error))}')</script>
            </div>
          </div>
        `)}
        ${ContactInfo(state.linkedDocuments.contact_info_ref)}
        ${Footer(state.linkedDocuments.footer_ref)}
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
