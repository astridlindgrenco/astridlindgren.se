var html = require('nanohtml')
var raw = require('nanohtml/raw')
var Section = require('../components/section')
var Header = require('../components/header')
var ContactInfo = require('../components/contact_info')
var Footer = require('../components/footer')
var DOM = require('prismic-dom')
var { linkResolver } = require('../resolve')
var { asText } = require('prismic-richtext')
const { getLocales, getAlternateLanguagePaths } = require('../locale')
const { image } = require('../components/base/utils/')

module.exports = (ctx) => {
  const state = ctx.state
  const doc = state.doc
  state.langs = getAlternateLanguagePaths(doc.alternate_languages)
  return html`
    <body>
      <div class="Page">
        ${Section(Header(state.navDocument, state.ui.header, getLocales(), state.locale, state.langs))}
        ${Section(html`<h1></h1>`)}
        ${Section(html`
          <div class="ErrorSection">
            <div class="ErrorSection-content">
              <div class="ErrorSection-content-wrapper">
                <div>
                  <h1>${asText(doc.data.title)}</h1>
                  ${raw(DOM.RichText.asHtml(doc.data.body, linkResolver))}
                </div>
                <div class="ErrorSection-content-wrapper-img">
                  ${Section(asImg(doc.data.image))}
                </div>
              </div>
              <script>console.error('${raw(JSON.stringify(state.error))}')</script>
            </div>
          </div>
        `)}
        ${ContactInfo(state.linkedDocuments.contact_info_ref)}
        ${Footer(state.linkedDocuments.footer_ref, ctx)}
        </div>
    </body>
  `
}

function asImg (img) {
  if (!img.url) return 'qwd'
  const responsiveImg = image(img, ['fw-small', 'hw-medium', 'hw-large', 'hw-xlarge'], 't-true')
  if (!img.alt) img.alt = '404?'
  return html`<img src="${responsiveImg.src}"
                   alt="${img.alt}"
                srcset="${responsiveImg.srcset}"
                 sizes="${responsiveImg.sizes}">`
}
