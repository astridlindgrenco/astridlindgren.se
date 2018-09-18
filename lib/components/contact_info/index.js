const html = require('nanohtml')
var asElement = require('prismic-element')
var serializer = require('../text/serializer')
var linkResolver = require('../../resolve')
var Section = require('../section')

let ContactInfo = (data) => {
  if (!data || !data.values().next().value) return html``
  data = data.values().next().value.data

  return Section({
    // TODO: change to new palette
    bg: 'Söderhavet ljusblå',
    isNarrow: true,
    push: true,
    body: html`
      <div class="ContactInfoBlock">
        <div class="Grid Grid--withGutter">
          <div class="Grid-cell u-md-size1of3 u-lg-size1of3">
            <div class="Text">
              <h2 class="Text-h3 ContactInfoBlock-header">${data.title}</h2>
            </div>
          </div>
          <div class="Grid-cell u-md-size2of3 u-lg-size2of3">
            <div class="Text Text--compact">
              ${asElement(data.body, linkResolver, serializer())}
            </div>
          </div>
        </div>
      </div>
    `
  })
}

module.exports = ContactInfo
