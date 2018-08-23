var html = require('nanohtml')
var Section = require('../components/section')
var Header = require('../components/header')
const { getLocales } = require('../locale')

module.exports = function home (state) {
  return html`
    <body>
      <div class="Page">
        ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
        ${Section(html`
          <div class="ErrorSection">
            <h1>Error</h1>
            <div class="ErrorSection-content">
              Something went really wrong, we'll be right back!
            </div>
          </div>
        `)}
        </div>
    </body>
  `
}
