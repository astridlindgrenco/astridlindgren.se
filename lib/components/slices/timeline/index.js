var html = require('nanohtml')
var asElement = require('prismic-element')
var { Link } = require('prismic-dom')
var linkResolver = require('../../../resolve')
var Section = require('../../section')
var Display = require('../../display')
var Category = require('../../category')

module.exports = timeline

/**
* Timeline section
*/

function timeline (slice, state, container) {
  var data = slice.primary
  var items = slice.items.map(function crateDisplayItem (item) {
    return {
      type: 'date',
      isRoundCover: true,
      cover: html`
        <p class="Text-bold">${item.year}</p>
      `,
      info: html`
        <div class="Text">
          <p class="Text-small">${item.info}</p>
        </div>
      `
    }
    /*

    <img alt="Omslag till ${item.year}"
    src="http://placehold.it/400x400?text=${item.year}">

     */
  })
  return Section({
    push: true,
    isFill: true,
    bg: data.theme_section_bg_color,
    header: html`
      ${Category(data.category)}
      ${data.intro_text ? html`<div class="Text">${asElement(data.intro_text)}</div>` : ''}
    `,
    footer: data.more_label
            ? html`<div class="Text"><p><a href="${Link.url(data.more_link, linkResolver)}}">${data.more_label}</a></p></div>`
            : false,
    body: Display(state, items, {
      xs: 2,
      sm: 2,
      md: 2,
      lg: 3,
      xl: 3
    })
  })
}
