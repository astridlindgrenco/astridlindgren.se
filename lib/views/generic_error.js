const html = require('nanohtml')
const raw = require('nanohtml/raw')
const Section = require('../components/section')
const Header = require('../components/header')
const { getLocales } = require('../locale')

module.exports = (state) => {
  return html`
    <body>
      <div class="Page">
        ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
        ${Section(html`
          <div class="ErrorSection">
            <h1>Error</h1>
            <div class="ErrorSection-content">
              <h2>Something went really really wrong, we'll be right back!</h2><br/>

              <script>console.error('${raw(JSON.stringify(state.error))}')</script>
            </div>
          </div>
        `)}
        </div>
    </body>
  `
}
