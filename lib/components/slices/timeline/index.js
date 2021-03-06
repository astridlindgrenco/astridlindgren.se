var html = require('nanohtml')
var asElement = require('prismic-element')
var { Link } = require('prismic-dom')
var { linkResolver } = require('../../../resolve')
const { getCustomFontClass } = require('../../base/fonts')
var serializer = require('../../text/serializer')
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
        <div class="Text--bold">
          <p>${item.year}</p>
        </div>
      `,
      info: html`
        <div class="Text Text--semiBold">
          <p class="Text-small">${item.info}</p>
        </div>
      `
    }
    /*

    <img alt="Omslag till ${item.year}"
    src="http://placehold.it/400x400?text=${item.year}">

     */
  })

  var introTextHeading = {
    classes: {
      heading2: {
        'Text-h3': true
      }
    }
  }

  if (state && state.font) introTextHeading.classes.heading2[getCustomFontClass(state.font)] = true
  return Section({
    push: true,
    isFill: true,
    isUnconstrained: true,
    isNarrow: true,
    bg: data.theme_section_bg_color,
    header: html`
      ${Category(data.category, data.category_icon ? data.category_icon.url : null)}
      ${data.intro_text ? html`<div class="Text">${asElement(data.intro_text, linkResolver, serializer(introTextHeading))}</div>` : ''}`,
    footer: data.more_label
      ? html`<div class="Text"><p><a href="${Link.url(data.more_link, linkResolver)}">${data.more_label}</a></p></div>`
      : false,
    body: Display(state, items, {
      xs: 1,
      sm: 2,
      md: 2,
      lg: 3,
      xl: 4
    })
  })
}
