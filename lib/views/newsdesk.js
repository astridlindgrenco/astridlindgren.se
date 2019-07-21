const html = require('nanohtml')
const Section = require('../components/section')
const Header = require('../components/header')
const Footer = require('../components/footer')
const ContactInfo = require('../components/contact_info')
const { getLocales, getAlternateLanguagePaths } = require('../locale')
const Newsdesk = require('../components/newsdesk')

module.exports = function newsdesk (ctx) {
  const state = ctx.state
  const doc = state.doc
  state.langs = getAlternateLanguagePaths(doc.alternate_languages)
  return html`
    <body>
      <div class="Page">
      ${Section(Header(state.navDocument, state.ui.header, getLocales(), state.locale, state.langs))}
      ${Section(Newsdesk(doc.data.subdomain))}
      ${ContactInfo(state.linkedDocuments.contact_info_ref, true)}
      ${Footer(state.linkedDocuments.footer_ref, ctx)}
      </div>
    </body>
  `
}
