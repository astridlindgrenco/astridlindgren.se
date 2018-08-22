const html = require('nanohtml')
var asElement = require('prismic-element')
var serializer = require('../text/serializer')
var linkResolver = require('../../resolve')

let ContactInfo = (data) => {
  if (!data) return html``
  data = data.values().next().value.data

  return html`
    <div class="contact_info_block">
      <div class="contact_info_block--content">
        <h1>${data.title}</h1>
        <div class="contact_info_block--conent--text">
          ${asElement(data.body, linkResolver, serializer())}
        </div>
      </div>
    </div>
  `
}

module.exports = ContactInfo
