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
  'timeline': require('./timeline'),
  'links': require('./links'),
  'q_and_a': require('./q_and_a'),
  'characters': require('./characters')
}

module.exports = renderSlice
function renderSlice (state, body, container = Section, ctx) {
  if (!Array.isArray(body)) return
  return body.map(function render (slice, index) {
    var sliceRenderer = slices[slice.slice_type]
    var prevSlice = body[index - 1]
    if (typeof sliceRenderer === 'function') {
      return sliceRenderer(slice, state, container, ctx, prevSlice)
    } else if (process.env.NODE_ENV === 'development') {
      return html`<p>unknown slice_type <code>${slice.slice_type}</code></p>`
    } else return ''
  })
}
