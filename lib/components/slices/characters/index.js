var html = require('nanohtml')
var asElement = require('prismic-element')
var { asText } = require('prismic-richtext')
var { Link } = require('prismic-dom')
var {linkResolver} = require('../../../resolve')
var Section = require('../../section')
var Display = require('../../display')
var Category = require('../../category')
const { image } = require('../../base/utils')

module.exports = shelf

/**
* Characters display.
* Requires characters in state.linkedDocuments.book.
*/

function shelf (slice, state, container, ctx) {
  var data = slice.primary
  var priorityItems = slice.items
  if (data.should_list_auto === 'Nej' && !priorityItems.length) return
  var characters = state.characters.items

  // If user has made manual sorting, we put those items in that exact order first
  if (characters.length && priorityItems.length) {
    let priorityIds = priorityItems.map(item => item.priority_character.id)
    let extracted = priorityIds.map(targetId => characters.find(item => item.id === targetId))
    characters = characters.filter(item => (priorityIds.indexOf(item.id) === -1))
    characters = extracted /* [...extracted, ...characters] */
  }
  var items = characters.filter(Boolean).map(function crateDisplayItem (item) {
    var data = item.data
    var title = asText(data.title)
    const profile = image(data.list_image, ['qw-small', 'qw-medium', 'qw-large', 'qw-xlarge'])
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
          <img alt="${data.list_image.alt}" class="Image"
            src="${profile.src}"
            alt="${profile.alt}"
            title="${data.list_image.copyright}"
            srcset="${profile.srcset}"
            sizes="${profile.sizes}" />
        </a>
      `,
      info: html`
        <div class="Text Text--smaller">
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
  return Section({
    push: true,
    isFill: true,
    isUnconstrained: true,
    bg: data.theme_section_bg_color,
    header: html`
      ${Category(data.category, data.category_icon ? data.category_icon.url : null)}
      ${data.intro_text ? html`<div class="Text">${asElement(data.intro_text)}</div>` : ''}
    `,
    footer: data.more_label
            ? html`<div class="Text"><p><a href="${Link.url(data.more_link, linkResolver)}}">${data.more_label}</a></p></div>`
            : false,
    body: Display(state, items, {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 5,
      xl: 6
    })
  })
}
