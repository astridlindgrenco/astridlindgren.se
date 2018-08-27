var html = require('nanohtml')
var Section = require('../components/section')
var Header = require('../components/header')
const Footer = require('../components/footer')
const ContactInfo = require('../components/contact_info')
const { getLocales } = require('../locale')
const Newsdesk = require('../components/newsdesk')

module.exports = function newsdesk (state) {
  var doc = state.pages.items.find(doc => doc.type === 'newsdesk')
  return html`
    <body>
      <div class="Page">
      ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
      ${Section(Newsdesk(doc.data.subdomain))}
      ${ContactInfo(state.linkedDocuments.contact_info_ref)}
      ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
  `
}
