const html = require('nanohtml')
var asElement = require('prismic-element')
var serializer = require('../text/serializer')
var linkResolver = require('../../resolve')

let Footer = (data) => {
  console.log(data)
  if (!data) return html``
  data = data.values().next().value.data

  return html('<footer></footer>')
}

module.exports = Footer
