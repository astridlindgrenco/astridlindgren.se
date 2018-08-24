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
  if (!state.linkedDocuments.book_ref) return
  var data = slice.primary

  let items = []
  state.linkedDocuments.book_ref.forEach((item) => {
    var title = item.data.book_title[0].text

    items.push({
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
    })
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
