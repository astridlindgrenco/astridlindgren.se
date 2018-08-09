'use strict'

/**
 * Render of the page type 'page'.
 */

var html = require('nanohtml')
var raw = require('nanohtml/raw')
var Section = require('../components/section')
var Header = require('../components/header')
var Slices = require('../components/slices')
var {asText} = require('prismic-richtext')
var DOM = require('prismic-dom')
var linkResolver = require('../resolve')

module.exports = function page (state) {
  const uid = (state.params.sub_path || state.params.path)
  const doc = state.pages.items.find(item => item.uid === uid)

  return html`
  <body>
    <div class="Page">
      ${Section(Header(state.navDocument, state.ui.header))}
      ${Section(html`<h1>${asText(doc.data.title)}</h1>`)}
      ${Section(asImg(doc.data.hero_image))}
      ${Section(raw(DOM.RichText.asHtml(doc.data.main_body, linkResolver)))}
      ${Section(raw(DOM.RichText.asHtml(doc.data.extra_body, linkResolver)))}
      ${Slices(doc.data.body, (html) => Section({ body: html, push: true }))}
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
       alt='${image.dimensions.alt || 'beskrivning saknas'}'>
  `
}
