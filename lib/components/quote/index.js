var serializer = require('../text/serializer')
var linkResolver = require('../../resolve')
var html = require('nanohtml')
var raw = require('nanohtml/raw')
var asElement = require('prismic-element')

module.exports = quote
function quote (body, cite) {
  // TODO add functionality for language specific quotation marks - get from language files
  const lq = '&rdquo;'
  const rq = '&rdquo;'
  return html`
    <div class="Quote">
      <div class="Quote-body">
      ${raw(lq)}${asElement(body, linkResolver, serializer())}${raw(rq)}
      </div>
      <div class="Quote-cite">${cite}</div>
    </div>
  `
}
