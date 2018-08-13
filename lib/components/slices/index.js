var html = require('nanohtml')
var Card = require('../card')
var Section = require('../section')
var Category = require('../category')
var Quote = require('../quote')

module.exports = slices
function slices (state, body, container = Section) {
  if (!Array.isArray(body)) return
  return body.map(function renderSlice (slice) {
    switch (slice.slice_type) {
     /**
      * Quote slice.
      * Uses a docment reference to the actual quote document, which must have been pre-feteched
      * and stored in the state store.
      */
      case 'quote':
        const quoteSlice = slice.primary
        if (state.linkedDocuments && state.linkedDocuments.quote_ref && quoteSlice.quote_ref) {
          const quoteDocumentMap = state.linkedDocuments.quote_ref
          const quoteDocument = quoteDocumentMap.get(quoteSlice.quote_ref.id)
          if (quoteDocument) {
            return container([
              Category(quoteSlice.category),
              Quote(quoteDocument.data.quote_body, quoteDocument.data.quote_source),
              html`
                <p><a href="${quoteSlice.quote_more_link}">${quoteSlice.quote_more_label}</a></p>
              `
            ])
          }
        }
        // fail - return identifing information
        return container([
          Category(quoteSlice.category),
          html`<p>Failed to find quote, id: ${quoteSlice.quote_ref.id}</p>`
        ])

     /**
      * Cards slice
      * Supports 1-4 cards, splits into 2 per row, single card is centered
      */
      case 'cards':
        let items = slice.items
        let cardPairs = chunkArray(items, 2)
        return container(cardPairs.map(cards => html`
         <div class="Grid Grid--withGutter Grid--equalHeight${items.length === 1 ? ' Grid--alignCenter' : ''}">
           ${cards.map(slice => html`
             <div class="Grid-cell u-lg-size1of2">
              ${Card(slice)}
             </div>
           `)}
           </div>
        `)
      )

      default:
        if (process.env.NODE_ENV === 'development') {
          return html`<p>unknown slice_type <code>${slice.slice_type}</code></p>`
        } else return ''
    }
  })
}

/**
 * Identity
 * Returns the passed value
 */
function identity (value) {
  return value
}

/**
 * Takes an array and returns a new chunked array
 */
function chunkArray (array, chunk) {
  if (!chunk) return array
  var chunked = []
  for (let i = 0, j = array.length; i < j; i += chunk) {
    chunked.push(array.slice(i, i + chunk))
  }
  return chunked
}
