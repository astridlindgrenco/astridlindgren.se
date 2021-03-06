const html = require('nanohtml')
const raw = require('nanohtml/raw')
const Section = require('../components/section')
const Header = require('../components/header')
const { getLocales, getAlternateLanguagePaths } = require('../locale')
const { __ } = require('../locale')

module.exports = (ctx) => {
  const state = ctx.state
  const doc = state.doc
  state.langs = getAlternateLanguagePaths(doc.alternate_languages)
  return html`
    <body>
      <div class="Page">
        ${Section(Header(state.navDocument, state.ui.header, getLocales(), state.locale, state.langs))}
        ${Section(html`
          <div class="ErrorSection">
            <div class="ErrorSection-content">
              <h2>${__('Error')}</h2>
              <div style="color:darkred;margin  :1em"><code>${state.error}</code></div>
              <script>console.error('${raw(JSON.stringify(state.error))}')</script>
            </div>
          </div>
        `)}
        </div>
    </body>
  `
}
