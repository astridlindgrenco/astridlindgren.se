var html = require('nanohtml')
var { chunkArray } = require('../../base/utils')
var Card = require('../../card')

module.exports = cards

/**
* Cards slice
* Supports 1-4 cards, splits into 2 per row, single card is centered
*/
function cards (slice, state, container) {
  var items = slice.items
  var cardPairs = chunkArray(items, 2)
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
          image: data.card_image,
          isLargerText: data.theme_text_size === 'Stor',
          divider: data.category_icon ? data.category_icon.url : null
        }, state)}
      </div>
    `)}
    </div>`)
    )
}

/**
 * Gets link if its valid
 * @param  {object} link The object to verify
 * @return {mixed}      The link if it's valid else undefined (to fail tests)
 */
function getLink (link) {
  return link && link.link_type !== 'Any' ? link : undefined
}
