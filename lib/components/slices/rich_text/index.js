var html = require('nanohtml')
var asElement = require('prismic-element')
var serializer = require('../../text/serializer')
var linkResolver = require('../../../resolve')
var { className } = require('../../base/utils')
var Section = require('../../section')

module.exports = richText

/**
* Rich text
*/
function richText (slice, state, container) {
  let data = slice.primary
  var isExpandable = data.theme_expandable_block === 'Ja'
  var hasCenteredText = data.theme_center_text === 'Ja'
  var hasIndentedText = data.theme_indent_text === 'Ja'
  var textClasses = className('Text', {
    'Text--indented': hasIndentedText
  })
  return Section({
    push: true,
    isNarrow: true,
    body: html`
      <div class="${textClasses}">
      ${asElement(data.body_text, linkResolver, serializer())}
      </div>
    `
  })
}
