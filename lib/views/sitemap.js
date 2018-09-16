const html = require('nanohtml')
const raw = require('nanohtml/raw')
const Header = require('../components/header')
const { getLocales } = require('../locale')
const Section = require('../components/section')

module.exports = (state, ctx) => {
  const keys = ctx.db.keys()
  let output = ''
  for (let key in keys) {
    const link = ctx.nodeCache.get(key)
    output += '<a href="/' + ctx.state.locale + link + '">' + link + '</a><br/>'
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
