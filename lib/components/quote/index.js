var serializer = require('../text/serializer')
var linkResolver = require('../../resolve')
var html = require('nanohtml')
var asElement = require('prismic-element')

module.exports = quote
function quote (body, cite) {
  return html`
    <div class="Quote">
      <div class="Quote-body">
      ${asElement(body, linkResolver, serializer())}
      </div>
      <div class="Quote-cite">${cite}</div>
    </div>
  `
}
