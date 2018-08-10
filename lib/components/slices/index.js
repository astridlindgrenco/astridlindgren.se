var html = require('nanohtml')
var { className } = require('../base/utils')
var Card = require('../card')
var Section = require('../section')
var Category = require('../category')
var Quote = require('../quote')

module.exports = slices
function slices (body, container = Section) {
  if (!body) return
  return body.map(function renderSlice (slice) {
    switch (slice.slice_type) {

      /**
       * Quote slice
       * TODO: Uses Document ref for actual quote, fetch somewhere earlier...
       */
      case 'quote':
        let data = slice.primary
        return container([
          Category(data.category),
          Quote(data.quote_ref.id, '- [Citerad]'), html`
            <p><a href="${data.quote_more_link}">${data.quote_more_label}</a></p>
          `
        ])
        break

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
              ${Card({
                title: slice.card_title,
                titleLink: slice.card_title_link,
                body: slice.card_body,
                moreLabel: slice.card_more_label,
                moreLink: slice.card_more_link,
                category: slice.category,
                image: slice.card_image
              })}
              </div>
          `)}
        </div>`)
      )
      break

      /**
      * Cards slice
      * Supports 1-4 cards, splits into 2 per row, single card is centered
      */
      case 'large_card':
        let item = slice.primary
        return container(html`
          ${Card({
            title: item.card_title,
            titleLink: item.card_title_link,
            body: item.card_body,
            moreLabel: item.card_more_label,
            moreLink: item.card_more_link,
            category: item.category,
            image: item.card_image,
            bg: item.theme_bg_color,
            layout: 'horisontal'
          })
          }
        `
      )
      break

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
