var html = require('nanohtml')
var asElement = require('prismic-element')
var { Link } = require('prismic-dom')
var {linkResolver} = require('../../../resolve')
var serializer = require('../../text/serializer')
const { getCustomFontClass } = require('../../base/fonts')
var Section = require('../../section')
var Category = require('../../category')
var LinkBlock = require('../../linkblock')

module.exports = links

/**
* Three linked blocks
* With or without images
*/
function links (slice, state, container) {
  var data = slice.primary
  var items = slice.items
  var header = []
  var footer = []

  var introTitleHeading = {
    classes: {
      heading2: {
      }
    }
  }

  if (state && state.font) introTitleHeading.classes.heading2[getCustomFontClass(state.font)] = true
  if (data.category) header.push(`${Category(data.category, data.category_icon ? data.category_icon.url : null)}`)
  if (data.intro_text.length || data.intro_title.length) {
    header.push(html`<div class="Display-title">${data.intro_title ? asElement(data.intro_title, linkResolver, serializer(introTitleHeading)) : ''}</div>
      <div class="Text">${asElement(data.intro_text ? data.intro_text : '')}</div>`)
  }
  if (data.more_label) footer.push(html`<div class="Text"><p><a href="${data.more_link}">${data.more_label}</a></p></div>`)
  return Section({
    push: true,
    bg: data.theme_section_bg_color,
    header: header.length ? header : null,
    footer: footer.length ? footer : null,
    body: html`
      <div class="Grid Grid--withGutter Grid--alignCenter">
        ${items.map((item, index) => html`
          <div class="Grid-cell u-md-size1of2 u-lg-size1of3">
            ${LinkBlock({
              label: item.link_label,
              href: Link.url(item.link_source, linkResolver),
              image: item.image,
              bg: item.theme_bg_color,
              priority: index === (items.length - 1) ? 'low' : 'high'
            })}
          </div>
        `)}
      </div>
    `
  })
}
