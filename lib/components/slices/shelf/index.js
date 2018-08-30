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
    console.log(item)
    var title = item.data.book_title[0].text
    items.push({
      type: item.type,
      cover: html`
        <a href="/${item.uid}">
        <img alt="Omslag till ${title}"
        src="${item.data.cover.url}"
        title="${item.data.cover.copyright}">
        </a>
      `,
      info: html`
        <div class="Text Text--smaller Display-booktitle">
          <p><a href="/${item.uid}">${title}</a></p>
          ${data.authors && data.authors !== 'Astrid Lindgren' ? html`<p>&ndash;</p><p>${data.authors}</p>` : ''}
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
      ${data.bookshelf_title ? html`
        <div class="Display-title">${asElement(data.bookshelf_title)}</div>` : ''}
        <img class="Display-krumelur" src="/krumelur.svg">
        ${data.titel ? html`<div class="Display-title">${asElement(data.titel)}</div>` : ''}
    `,
    footer: html`
      <img class="Display-knallpuff" src="/knallpuff.svg">
    `,
    body: Display(state, items)
  })
}

/**
 *
      ${data.more_label ? html`<div class="Text"><p><a href="${Link.url(data.more_link, linkResolver)}}">${data.more_label}</a></p></div>` : ''}

 */
