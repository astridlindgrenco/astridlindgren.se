'use strict'
var html = require('nanohtml')
var header = require('../components/header')
var { asText } = require('prismic-richtext')
const DOM = require('prismic-dom')

module.exports = function page (state) {
  const uid = (state.params.sub_path || state.params.path)
  const doc = state.pages.items.find(item => item.uid === uid)
  const page = doc.data
  // FIXME: temporary 400 page
  if (page.error) {
    return html`<p>${page.text}</p>`
  }

  const lang = doc.lang
  const slug = doc.slugs[0] || '' 
  const title = html(DOM.RichText.asHtml(doc.data.title))
  const image = doc.data.image
  const text = html(DOM.RichText.asHtml(doc.data.text))
  
  let slices = ''
  page.body.forEach (slice => {
    switch(slice.slice_type) {
      case 'qoute':
        slices += `<p><blockquote>${slice.primary['quote-text'][0].text}</blockquote>
                   <cite>${slice.primary['quote-source'][0].text}</cite></p>`
        break
      case 'mellanrubbe':
        //slices += `<h2>${slice.primary['rubbe'][0].text}</h2>`
        slices += DOM.RichText.asHtml(slice.primary.rubbe)
        break
      default:
        slices += `<p>unknown slice_type <code>${slice.slice_type}</code></p>`
    }
  })
  
  return html`
  <div class="Page">
    ${header(state.nav, uid)}
    ${title}
    ${Image(image)}
    ${text}
    <div>
      ${html(slices)}
    </div
  </div>
`
}

function Image(image) {
  return html`
  <img src='${html(image.url)}' 
     width='${image.dimensions.width}px' 
    height='${image.dimensions.height}px' 
       alt='${image.dimensions.alt || "beskrivning saknas"}'>
  `
}