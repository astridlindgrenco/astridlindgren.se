var html = require('nanohtml')
var Card = require('../../card')
var Section = require('../../section')
var linkResolver = require('../../../resolve')

module.exports = largeCard

/**
* Large card slice
* Supports a single card
*/
function largeCard (slice, state, container) {
  var data = slice.primary
  var isFullWidth = data.theme_full_width === 'Ja'
  console.log('largeCard', data.card_title_link, !!state.db)
  return Section({
    push: true,
    isFillLarge: isFullWidth,
    body: html`
      ${Card({
        title: data.card_title,
        titleLink: linkResolver(state.db, data.card_title_link),
        body: data.card_body,
        moreLabel: data.card_more_label,
        moreLink: data.card_more_link,
        category: data.category,
        image: data.card_image,
        bg: data.theme_bg_color,
        isReversed: data.theme_image_pos === 'Höger',
        isFullWidth: isFullWidth,
        layout: 'horisontal'
      }, state)
      }
    `
  })
}
