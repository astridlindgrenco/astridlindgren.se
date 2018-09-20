var html = require('nanohtml')
var Card = require('../../card')
var Section = require('../../section')

module.exports = largeCard

/**
* Large card slice
* Supports a single card
*/
function largeCard (slice, state, container) {
  var data = slice.primary
  var isFullWidth = data.theme_full_width === 'Ja'
<<<<<<< HEAD
  console.log('[LargeCard]:', data.card_title_link.link_type)
=======

>>>>>>> 5c65106be352f30eef604d2f0cf427af4e2ada70
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
        layout: 'horisontal',
        divider: data.category_icon ? data.category_icon.url : null
      }, state)
      }
    `
  })
}

/**
 * Gets link if its valid
 * @param  {object} link The object to verify
 * @return {mixed}      The link if it's valid else undefined (to fail tests)
 */
function getLink (link) {
  return link && link.link_type !== 'Any' ? link : undefined
}
