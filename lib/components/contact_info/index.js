const html = require('nanohtml')
var asElement = require('prismic-element')
var serializer = require('../text/serializer')
var linkResolver = require('../../resolve')

let ContactInfo = (data) => {
  if (!data || !data.values().next().value) return html``
  data = data.values().next().value.data

  return html`
    <div class="ContactInfoBlock">
      <div class="ContactInfoBlock-content">
        <h1>${data.title}</h1>
        <div class="ContactInfoBlock-conent-text">
          ${asElement(data.body, linkResolver, serializer())}
        </div>
      </div>
    </div>
  `
}

module.exports = ContactInfo
