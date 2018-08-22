var html = require('nanohtml')
var Section = require('../components/section')
var Header = require('../components/header')
const Footer = require('../components/footer')
const { getLocales } = require('../locale')
const MyNewsdesk = require('../components/mynewsdesk')

module.exports = function newsroom (state) {
  var doc = state.pages.items.find(doc => doc.type === 'mynewsdesk')
  if (!doc) return null
  return html`
    <body>
      <div class="Page">
      ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
      ${Section(MyNewsdesk(doc))}
      ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
  `
}
