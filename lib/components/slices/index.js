var html = require('nanohtml')
var { asText } = require('prismic-richtext')
var asElement = require('prismic-element')
var serializer = require('../text/serializer')
var linkResolver = require('../../resolve')
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
      case 'quote': {
        let quoteSlice = slice.primary
        if (state.linkedDocuments && state.linkedDocuments.quote_ref && quoteSlice.quote_ref) {
          let quoteDocumentMap = state.linkedDocuments.quote_ref
          let quoteDocument = quoteDocumentMap.get(quoteSlice.quote_ref.id)
          if (quoteDocument) {
            return container([
              quoteSlice.category ? html`<div class="Text--center">${Category(quoteSlice.category)}</div>` : undefined,
              Quote(quoteDocument.data.quote_body, quoteDocument.data.quote_source),
              html`
                <p class="Quote-more"><a href="${quoteSlice.quote_more_link}">${quoteSlice.quote_more_label}</a></p>
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


      /**
      * Cards slice
      * Supports 1-4 cards, splits into 2 per row, single card is centered
      */
      case 'cards': {
        let items = slice.items
        let cardPairs = chunkArray(items, 2)
        return container(cardPairs.map(cards => html`
          <div class="Grid Grid--withGutter Grid--equalHeight${items.length === 1 ? ' Grid--alignCenter' : ''}">
            ${cards.map(data => html`
              <div class="Grid-cell u-lg-size1of2">
              ${Card({
                title: data.card_title,
                titleLink: getLink(data.card_title_link),
                body: data.card_body,
                moreLabel: data.card_more_label,
                moreLink: data.card_more_link,
                category: data.category,
                image: data.card_image
              })}
              </div>
          `)}
        </div>`)
        )
      }

      /**
      * Large card slice
      * Supports a single card
      */
      case 'large_card': {
        let data = slice.primary
        var isFullWidth = data.theme_full_width === 'Ja'
        return Section({
          push: true,
          isFillLarge: isFullWidth,
          body: html`
            ${Card({
              title: data.card_title,
              titleLink: getLink(data.card_title_link),
              body: data.card_body,
              moreLabel: data.card_more_label,
              moreLink: data.card_more_link,
              category: data.category,
              image: data.card_image,
              bg: data.theme_bg_color,
              isReversed: data.theme_image_pos === 'Höger',
              isFullWidth: isFullWidth,
              layout: 'horisontal'
            })
            }
          `
        })
      }

      /**
      * Rich text
      */
      case 'rich_text': {
        let data = slice.primary
        var isExpandable = data.theme_expandable_block === 'Ja'
        var hasCenteredText = data.theme_center_text === 'Ja'
        return Section({
          push: true,
          isNarrow: true,
          body: html`
            <div class="Text">
              ${asElement(data.body_text, linkResolver, serializer())}
            </div>
          `
        })
      }

      default:
        if (process.env.NODE_ENV === 'development') {
          return html`<p>unknown slice_type <code>${slice.slice_type}</code></p>`
        } else return ''
    }
  })
}

/**
 * Checks if a theme is set by user choice
 * @param  {String} themeKey         The key to look for
 * @param  {Object} data             Data structure to search
 * @param  {String} [prefix='theme'] Prefix to use for key lookup.
 * @return {Boolean}                 True if the key was found and was set to human readable true
 */
function themeIsSet (themeKey, data, prefix = 'theme') {
  if (!themeKey) return false
  return data[`${prefix}_${themeKey}`] === 'Ja' ? true : false
}

/**
 * Gets link if its valid
 * @param  {object} link The object to verify
 * @return {mixed}      The link if it's valid else undefined (to fail tests)
 */
function getLink (link) {
  return link.link_type !== 'Any' ? link : undefined
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
