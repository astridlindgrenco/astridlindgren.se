var html = require('nanohtml')
var asElement = require('prismic-element')
var { Link } = require('prismic-dom')
var linkResolver = require('../../../resolve')
var Section = require('../../section')
var Display = require('../../display')
var Category = require('../../category')

module.exports = shelf

/**
* Book display.
* Requires books in state.linkedDocuments.book.
*/

function shelf (slice, state, container) {
  var data = slice.primary
  var items = getLinkedDocsInSlices(slice.items, state).map(function crateDisplayItem (item) {
    var title = item.data.book_title[0].text
    return {
      type: item.type,
      cover: html`
        <a href="/${item.uid}">
        <img alt="Omslag till ${title}"
        src="${item.data.cover.url}">
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
    bg: data.theme_section_bg_color,
    header: html`
      ${Category(data.category)}
      ${data.intro_text ? html`<div class="Text">${asElement(data.intro_text)}</div>` : ''}
    `,
    footer: data.more_label
            ? html`<div class="Text"><p><a href="${Link.url(data.more_link, linkResolver)}}">${data.more_label}</a></p></div>`
            : false,
    body: Display(state, items)
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
