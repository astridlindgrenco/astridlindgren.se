var html = require('nanohtml')
var asElement = require('prismic-element')
var { asText } = require('prismic-richtext')
var { Link } = require('prismic-dom')
var { linkResolver } = require('../../../resolve')
const serializer = require('../../text/serializer')
var Section = require('../../section')
var Display = require('../../display')
var Category = require('../../category')
const { characterImage } = require('../../base/utils')
const { getCustomFontClass } = require('../../base/fonts')

module.exports = characterDisplay

/**
* Characters display.
* Requires characters in state.linkedDocuments.book.
*/

function characterDisplay (slice, state, container, ctx) {
  var data = slice.primary
  var itemsByPriority = slice.items
  var characterDocuments = state.characters.items
  if (!characterDocuments.length && !itemsByPriority.length) return
  // Make sure characters are listed in exact order used in Prismic
  characterDocuments = itemsByPriority.map(item => characterDocuments.find(character => character.id === item.priority_character.id))
  var items = characterDocuments.filter(Boolean).map(function crateDisplayItem (item) {
    var data = item.data
    var title = asText(data.title)
    const profile = characterImage(data.list_image.url)
    return {
      type: 'character',
      isRoundCover: true,
      cover: html`
        <a href="${linkResolver({
    uid: item.uid,
    id: item.id,
    lang: state.lang,
    link_type: 'Document',
    type: 'page'
  })}">
          <img class="Image" alt="${profile.alt}"
            title="${data.list_image.copyright}"
            srcset="${profile.srcset}"
            src="${profile.src}">
        </a>
      `,
      info: html`
        <div class="Text Text--smaller Text--adaptive">
          <p><a href="${linkResolver({
    uid: item.uid,
    id: item.id,
    lang: state.lang,
    link_type: 'Document',
    type: 'page'
  })}">${title}</a></p>
        </div>
      `
    }
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
    bg: data.theme_section_bg_color,
    header: html`
      ${Category(data.category, data.category_icon ? data.category_icon.url : null)}
      ${data.intro_text ? html`<div class="Text">${asElement(data.intro_text, linkResolver, serializer(introTextHeading))}</div>` : ''}`,
    footer: data.more_label
      ? html`<div class="Text"><p><a href="${Link.url(data.more_link, linkResolver)}}">${data.more_label}</a></p></div>`
      : false,
    body: Display(state, items, {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 3,
      xl: 4
    }, data.should_wrap_rows === 'Ja')
  })
}
