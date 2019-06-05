var html = require('nanohtml')
var { uppercase, lowercase } = require('../base/utils')

module.exports = langswitcher

function langswitcher ({ langs, title }) {
  return html`
  <div>
    <strong>${title}</strong>
    ${langs.map(element => {
    return html` <a href="${element.url}" lang="${element.name}" title=""> ${uppercase(element.name)} </a> `
  })}
  </div>
  `
}
// const resolvedDoc = linkmap.get(doc.id)
//* <a href="/sv" lang="sv" title="Svenska">SV</a>
// <a href="/en" lang="en" title="English">EN</a>
// <a href="/de" lang="de" title="Deutsch">DE</a> */}
