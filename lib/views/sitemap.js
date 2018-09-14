const html = require('nanohtml')
const raw = require('nanohtml/raw')
const Header = require('../components/header')
const { getLocales } = require('../locale')
const Section = require('../components/section')

module.exports = (state, ctx) => {
  let cacheFile = require('../../cache.json')

  let output = ''
  for (let key in cacheFile) {
    output += '<a href="/' + ctx.state.lang + cacheFile[key] + '">' + cacheFile[key] + '</a><br/>'
  }

  return html`
    <body>
      <div class="Page">
        ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
        ${Section({
          push: true,
          isNarrow: true,
          body: raw(output)
        })}
      </div>
    </body>
  `
}
