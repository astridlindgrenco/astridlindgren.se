var html = require('nanohtml')
var asElement = require('prismic-element')
var { asText } = require('prismic-richtext')
var { Link } = require('prismic-dom')
var linkResolver = require('../../../resolve')
var Section = require('../../section')
var Display = require('../../display')
var Category = require('../../category')

module.exports = shelf

/**
* Characters display.
* Requires characters in state.linkedDocuments.book.
*/

function shelf (slice, state, container) {
  var data = slice.primary
  var priorityItems = slice.items
  if (data.should_list_auto === 'Nej' && !priorityItems.length) return
  var characters = state.characters.items

  // If user has made manual sorting, we put those items in that exact order first
  if (characters.length && priorityItems.length) {
    let priorityIds = priorityItems.map(item => item.priority_character.id)
    let extracted = priorityIds.map(targetId => characters.find(item => item.id === targetId))
    characters = characters.filter(item => (priorityIds.indexOf(item.id) === -1))
    characters = [...extracted, ...characters]
  }
  var items = characters.map(function crateDisplayItem (item) {
    var data = item.data
    var title = asText(data.title)
    return {
      type: 'character',
      isRoundCover: true,
      cover: html`
        <a href="/${item.uid}">
          <img alt="${data.list_image.alt}" src="${data.list_image.url}">
        </a>
      `,
      info: html`
        <div class="Text Text--smaller">
          <p><a href="/${item.uid}">${title}</a></p>
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
      ${Category(data.category)}
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

/**
 * Gets linked document from state if present
 * @param  {Array} items An array of documents and/or document links
 * @return {Array}       An array of documents
 */
function getLinkedDocsInSlices (slices, state) {
  // Get slice from state if it's linked else use as is
  var items = slices.map(item => Object.values(item)[0])
  return items.map(item => item.link_type === 'Document' ? state.linkedDocuments[item.type].get(item.id) : item)
}
