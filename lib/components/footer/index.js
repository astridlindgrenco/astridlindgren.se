const html = require('nanohtml')
var asElement = require('prismic-element')
var serializer = require('../text/serializer')
var linkResolver = require('../../resolve')

let Footer = (data) => {
  if (!data) return html``
  data = data.values().next().value.data

  return html`
    <footer>
      <h1>${data.title}</h1>
      <div>
        ${asElement(data.body, linkResolver, serializer())}
      </div>
    </footer>
  `
}

module.exports = Footer
