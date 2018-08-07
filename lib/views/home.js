var html = require('nanohtml')
var Section = require('../components/section')
var Header = require('../components/header')
var Slices = require('../components/slices')
var { asText } = require('prismic-richtext')

module.exports = function home (state) {
  var doc = state.pages.items.find(doc => doc.type === 'home')
  return html`
    <div class="Page">
      ${Section(Header(state.navDocument, false))}
      ${Section(html`<h1>${asText(doc.data.title)}</h1>`)}
      ${Slices(doc.data.body, (html) => Section({ body: html, push: true }))}
    </div>
  `
}
