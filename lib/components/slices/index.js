var html = require('nanohtml')
var Section = require('../section')

/**
 * Slices
 * Prismc slice API name vs renderer
 */
const slices = {
  'quote': require('./quote'),
  'cards': require('./cards'),
  'large_card': require('./large_card'),
  'rich_text': require('./rich_text'),
  'text_and_image': require('./text_and_image'),
  'bokhylla': require('./shelf'),
  'mynewsdesk': require('./mynewsdesk'),
  'timeline': require('./timeline'),
  'links': require('./links')
}

module.exports = renderSlice
function renderSlice (state, body, container = Section) {
  if (!Array.isArray(body)) return
  return body.map(function render (slice) {
    var sliceRenderer = slices[slice.slice_type]
    if (typeof sliceRenderer === 'function') {
      return sliceRenderer(slice, state, container)
    } else if (process.env.NODE_ENV === 'development') {
      return html`<p>unknown slice_type <code>${slice.slice_type}</code></p>`
    } else return ''
  })
}
