var html = require('nanohtml')
var asElement = require('prismic-element')
var serializer = require('../../text/serializer')
var {linkResolver} = require('../../../resolve')
var { className } = require('../../base/utils')
var Section = require('../../section')

module.exports = richText

/**
* Rich text
* 1. If it an expandable block and comes directly after a rich_text assume they should be grouped
*/
function richText (slice, state, container, ctx, prevSlice) {
  let data = slice.primary
  var isExpandable = data.theme_expandable_block === 'Ja'
  var hasCenteredText = data.theme_center_text === 'Ja'
  var hasIndentedText = data.theme_indent_text === 'Ja'
  var textClasses = className('Text', {
    'Text--indented': hasIndentedText,
    'Text--center': hasCenteredText
  })
  var previousSliceType = prevSlice ? prevSlice.slice_type : ''
  var tightenMarginToPrevious = previousSliceType === 'rich_text' && isExpandable
  return Section({
    isExpandable,
    pullTop: tightenMarginToPrevious, /* 1 */
    push: true,
    isNarrow: true,
    body: html`
      <div class="${textClasses}">
      ${asElement(data.body_text, linkResolver, serializer())}
      </div>
    `
  })
}
