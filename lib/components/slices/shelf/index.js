var html = require('nanohtml')
var asElement = require('prismic-element')
var linkResolver = require('../../../resolve')
var Section = require('../../section')
var Display = require('../../display')
var Category = require('../../category')
var { Link } = require('prismic-dom')

module.exports = shelf

/**
* Book display.
* Requires books in state.linkedDocuments.book.
*/

function shelf (slice, state, container) {
  if (!state.linkedDocuments.book_ref) return
  var data = slice.primary
  var items = []
  var books = slice.items.map(bookRef => state.linkedDocuments.book_ref.get(bookRef.book.id))
  books.forEach((item) => {
    if (!item || !item.data) return
    var title = item.data.book_title[0].text
    const href = linkResolver(item)
    items.push({
      type: item.type,
      cover: html`
        <a href="${href}">
          <img alt="Omslag till ${title}" src="${item.data.cover.url}" title="${item.data.cover.copyright}">
        </a>
      `,
      info: html`
        <p class="Text Text--smaller Display-booktitle">
          <a href="${href}">${title}</a>
        </p>
        <p class="Text Text--smaller Display-booktitle">
          ${data.authors && data.authors !== 'Astrid Lindgren' ? html`<p>&ndash;</p><p>${data.authors}</p>` : ''}
        </p>
      `
    })
  })
  return Section({
    push: true,
    isFill: true,
    bg: data.theme_section_bg_color,
    header: html`
      ${Category(data.category, html`<img class="Display-krumelur" src="/krumelur.svg">`)}
      ${data.bookshelf_title ? html`
        <div class="Display-title">${asElement(data.bookshelf_title)}</div>` : ''}
        ${data.titel ? html`<div class="Display-title">${asElement(data.titel)}</div>` : ''}
    `,
    footer: html`
      ${data.more_label ? html`<div class="Text"><p><a href="${linkResolver(data.more_link)}">${data.more_label}</a></p></div>` : ''}
    `,
    body: Display(state, items)
  })
}
