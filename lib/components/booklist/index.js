'use strict'

/**
 * Return books according to view type: grid or list.
 */

const html = require('nanohtml')
const asElement = require('prismic-element')
const linkResolver = require('../../resolve')
const serializer = require('../text/serializer')
const { __ } = require('../../locale')

module.exports = function Booklist (books, viewBy) {
  if (viewBy === 'list') return asList(books)
  return asGrid(books)
}

function asList (books) {
  return html`
  <div class="Booklist">
    <ul class="Booklist-list">
      ${books.map(listBook)}
    </ul>
  </div>
  `
}

function asGrid (books) {
  return html`
  <div class="Booklist">
    <div class="Booklist-grid">
      <div class="Grid Grid--withGutter">
        ${books.map(gridBook)}
      </div>
    </div>
  </div>
  `
}

function listBook (book) {
  const title = book.data.book_title[0].text
  const cover = book.data.cover
  const authorYear = book.data.author_year
  const abstract = asElement(book.data.abstract, linkResolver, serializer())
  const authors = book.data.authors !== 'Astrid Lindgren'
    ? html`
      <div>
        <p>${__('Author')}</p>
        <p>${book.data.authors}</p>
      </div>`
    : ''
  const illustrators = book.data.illustrators > ''
    ? html`
      <div>
        <p>${__('Illustrator')}</p>
        <p>${book.data.illustrators}</p>
      </div>`
    : ''
  return html`
    <div class="Grid Grid--withGutter">
      <div class="Grid-cell u-md-size1of4 u-lg-size1of4">
        <img class="Booklist-cover--listview" src="${cover.url}">
      </div>
      <div class="Grid-cell u-md-size3of4 u-lg-size3of4">
        <div class="Text">
          <h3>${title}</h3>
          <p>${authorYear}</p>
          ${authors}
          ${illustrators}
          <p>${abstract}</p>
        </div>
      </div>
    </div>
  `
}

function gridBook (book) {
  const title = book.data.book_title[0].text
  const cover = book.data.cover
  const authorYear = book.data.author_year || '?author_year'
  const authors = book.data.authors && book.data.authors !== 'Astrid Lindgren'
    ? ` ${__('by')} ${book.data.authors}, `
    : book.data.authors ? book.data.authors : '?authors'
  return html`
    <div class="Grid-cell u-sm-size1of2 u-md-size1of3 u-lg-size1of5">
      <img class="Booklist-cover--gridview"
            src="${cover.url}"
          title="${title}${authors}, ${authorYear}"
            alt="${__('Cover of a book')}">
    </div>
  `
}
