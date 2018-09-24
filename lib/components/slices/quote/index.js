const html = require('nanohtml')
const Quote = require('../../quote')
const Category = require('../../category')
const {linkResolver} = require('../../../resolve')

module.exports = quote

/**
 * Quote slice.
 * Uses a docment reference to the actual quote document, which must have been pre-feteched
 * and stored in the state store.
 */
function quote (slice, state, container) {
  let quoteSlice = slice.primary
  if (state.linkedDocuments && state.linkedDocuments.quote_ref && quoteSlice.quote_ref) {
    let quoteDocumentMap = state.linkedDocuments.quote_ref
    let quoteDocument = quoteDocumentMap.get(quoteSlice.quote_ref.id)

    if (quoteDocument) {
      return container([
        quoteSlice.category ? html`<div class="Text--center">${Category(quoteSlice.category, quoteDocument.data.category_icon ? quoteDocument.data.category_icon.url : null)}</div>` : undefined,
        Quote(quoteDocument.data.quote_body, quoteDocument.data.quote_source, undefined, state),
        html`
          <p class="Quote-more"><a href="${linkResolver(quoteSlice.quote_more_link)}">${quoteSlice.quote_more_label}</a></p>
        `
      ])
    }
  }
  // fail - return identifing information
  return container([
    Category(quoteSlice.category),
    html`<p>Failed to find quote, id: ${quoteSlice.quote_ref.id}</p>`
  ])
}
