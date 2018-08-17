'use strict'

/**
 * A book stand display book covers in a horisonal way.
 * The book stand has a title and a read more link.
 */

var { asText } = require('prismic-richtext')
var html = require('nanohtml')
var raw = require('nanohtml/raw')

module.exports = function bookDisplay (state, slice) {
  let booksHtml = ''
  if (state.linkedDocuments.book) {
    state.linkedDocuments.book.forEach(book => {
      // TODO add loacalization on alt-tag
      console.log(book.uid)
      booksHtml += html`
        <div class="BookDisplay-book">
          <a href="/${book.uid}">
            <img class="BookDisplay-book-cover"
                  alt="Omslag till ${book.data.book_title[0].text}"
                  src="${book.data.cover.url}"
                title="${book.data.book_title[0].text}">
            <p class="BookDisplay-book-title">${book.data.book_title[0].text}</p>
          </a>
        </div>`
    })
  }
  return html`
    <div class="BookDisplay">
      <h2 class="BookDisplay-title">${asText(slice.primary.bookshelf_title)}</h2>
      <div class="BookDisplay-shelf">${raw(booksHtml)}</div>
    <p><a class="BookDisplay-more" href="#${slice.primary.more_link}">Mer om verken</a></p>
  </div>`
}

/**
 * Prepends and appends quote characters to Prismic StructuredText object
 * @param {Object} body A Prismic StructuredText object
 */
function addQuoteMarks (body) {
  const lq = __('left-quote')
  const rq = __('right-quote')
  const newBody = Object.assign(body)
  if (newBody.length > 0 && lq && rq) {
    newBody[0].text = `${lq}${newBody[0].text}`
    newBody[newBody.length - 1].text = `${newBody[newBody.length - 1].text}${rq}`
  }
  return newBody
}
