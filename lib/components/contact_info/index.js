const html = require('nanohtml')
var asElement = require('prismic-element')
var serializer = require('../text/serializer')
var linkResolver = require('../../resolve')

let ContactInfo = (data) => {
  if (!data) return html``
  data = data.values().next().value.data

  return html`
    <div class="contact_info_block">
      <h1>${data.title}</h1>
      <div>
        ${asElement(data.body, linkResolver, serializer())}
      </div>
    </div>
  `
}

module.exports = ContactInfo
