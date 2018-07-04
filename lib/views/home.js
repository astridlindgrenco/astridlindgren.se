var html = require('nanohtml')
var header = require('../components/header')
var { asText } = require('prismic-richtext')

module.exports = function home (state) {
  var doc = state.pages.items.find(doc => doc.type === 'startsida')
  return html`
    <div class="Page">
      ${header(asText(doc.data.title))}
    </div>
  `
}
