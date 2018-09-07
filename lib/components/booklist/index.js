'use strict'

/**
 * Return books according to view type: grid or list.
 */

const html = require('nanohtml')
const asElement = require('prismic-element')
const linkResolver = require('../../resolve')
const serializer = require('../text/serializer')
const { __ } = require('../../locale')
const { image } = require('../base/utils/')

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
  const cover = image(book.data.cover, ['qw-small', 'qw-medium', 'qw-large', 'qw-xlarge'])
  const authorYear = book.data.author_year
  const abstract = asElement(book.data.abstract, linkResolver, serializer())
  const authors = book.data.authors !== 'Astrid Lindgren'
    ? html`
      <div class="Booklist-authors--listview">
        <p>${__('Author')}</p>
        <p>${book.data.authors}</p>
      </div>`
    : ''
  const byline = authors > ''
    ? `, ${__('by')} ${book.data.authors}`
    : ''
  const coverCopy = cover.copyright > ''
    ? `. ${cover.copyright}.`
    : ''
  const illustrators = book.data.illustrators > ''
    ? html`
      <div class="Booklist-authors--listview">
        <p>${__('Illustrator')}</p>
        <p>${book.data.illustrators}</p>
      </div>`
    : ''
  const photograpers = book.data.photograpers > ''
    ? html`
      <div class="Booklist-authors--listview">
        <p>${__('Photograpers')}</p>
        <p>${book.data.photograpers}</p>
      </div>`
    : ''
  return html`
    <div class="Grid Grid--withGutter">
      <div class="Grid-cell u-md-size1of4 u-lg-size1of4">
        ${cover
          ? html`
            <img class="Booklist-cover--gridview"
                  src="${cover.src}"
                title="${title}${byline}, ${authorYear}${coverCopy}"
                  alt="${__('Cover of a book')}"
                srcset="${cover.srcset}"
                sizes="${cover.sizes}">`
          : null
        }
      </div>
      <div class="Grid-cell u-md-size3of4 u-lg-size3of4">
        <div class="Text">
          <h2 class="Booklist-title--listview">${title}</h2>
          <div class="Booklist-authorYear--listview">
            <p>${authorYear}</p>
          </div>
          ${authors}
          ${illustrators}
          ${photograpers}
          <p class="Booklist-abstract--listview">${abstract}</p>
        </div>
      </div>
    </div>
  `
}

function gridBook (book) {
  const title = book.data.book_title[0] ? book.data.book_title[0].text : '?title'
  const cover = image(book.data.cover, ['hw-small', 'hw-medium', 'hw-large', 'qw-xlarge'])
  const authorYear = book.data.author_year > '' ? book.data.author_year : '?author_year'
  const authors = book.data.authors === 'Astrid Lindgren' ? '' : book.data.authors
  const byline = authors > ''
    ? `, ${__('by')} ${book.data.authors}, `
    : ''
  const coverCopy = cover.copyright > ''
    ? `. ${cover.copyright}.`
    : ''
  return html`
    <div class="Grid-cell u-sm-size1of2 u-md-size1of3 u-lg-size1of5">
      ${cover
        ? html`
          <img class="Booklist-cover--gridview"
                 src="${cover.src}"
               title="${title}${byline}, ${authorYear}${coverCopy}"
                 alt="${__('Cover of a book')}"
              srcset="${cover.srcset}"
               sizes="${cover.sizes}">`
        : null
      }
      <h2 class="Booklist-title--gridview">${title}</h2>
      <p class="Booklist-authors--gridview">${authors}</p>
      <p class="Booklist-authorYear--gridview">${authorYear}</p>
    </div>
  `
}
