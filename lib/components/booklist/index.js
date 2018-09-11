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
  <div class="Booklist Booklist--listview">
    <ul class="Booklist-list">
      ${books.map(listBook)}
    </ul>
  </div>
  `
}

function asGrid (books) {
  return html`
  <div class="Booklist Booklist--gridview">
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
      <div class="Booklist-authors">
        <p><strong>${__('Author')}:</strong> ${book.data.authors}</p>
      </div>`
    : ''
  const illustrators = book.data.illustrators > ''
    ? html`
      <div class="Booklist-authors">
        <p><strong>${__('Illustrator')}:</strong> ${book.data.illustrators}</p>
      </div>`
    : ''
  const photograpers = book.data.photograpers > ''
    ? html`
      <div class="Booklist-authors">
        <p><strong>${__('Photograpers')}:</strong> ${book.data.photograpers}</p>
      </div>`
    : ''
  return html`
    <div class="Booklist-book">
      <div class="Grid Grid--withGutter">
        <div class="Grid-cell u-md-size1of4 u-lg-size1of4">
          <img class="Booklist-cover" src="${cover.url}" title="${cover.copyright}">
        </div>
        <div class="Grid-cell u-md-size3of4 u-lg-size3of4">
          <div class="Text">
            <h2 class="Text-h3 Booklist-title">${title}</h2>
            <div class="Booklist-authorYear">
              <p>${authorYear}</p>
            </div>
            ${authors}
            ${illustrators}
            ${photograpers}
            <div class="Text--smaller Booklist-abstract">${abstract}</div>
          </div>
        </div>
      </div>
    </div>
  `
}

function gridBook (book) {
  const title = book.data.book_title[0] ? book.data.book_title[0].text : '?title'
  const cover = book.data.cover
  const authorYear = book.data.author_year > '' ? book.data.author_year : '?author_year'
  const authors = book.data.authors === 'Astrid Lindgren' ? '' : book.data.authors
  const byline = authors > ''
    ? `, ${__('by')} ${book.data.authors}, `
    : ''
  return html`
    <div class="Grid-cell u-sm-size1of1 u-md-size1of3 u-lg-size1of5">
      <div class="Booklist-book">
        <img class="Booklist-cover"
              src="${cover.url}"
            title="${title}${byline}, ${authorYear}"
              alt="${__('Cover of a book')}">
        <div class="Text Text--smaller">
          <h2 class="Text-h4 Booklist-title">${title}</h2>
          ${authors ? html`<p class="Text-small Booklist-authors">${authors}</p>` : ''}
          <p class="Text-small Booklist-authorYear">${authorYear}</p>
        </div>
      </div>
    </div>
  `
}
