'use strict'

/**
 * Return books according to view type: grid or list.
 */

const html = require('nanohtml')
const asElement = require('prismic-element')
const linkResolver = require('../../resolve')
const serializer = require('../text/serializer')

module.exports = function Booklist (books, doc) {
  console.log(books.length)
  return asList(books)
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

function listBook (book) {
  const title = book.data.book_title[0].text
  const cover = book.data.cover
  const authorYear = book.data.author_year
  const abstract = asElement(book.data.abstract, linkResolver, serializer())
  console.log(cover)
  return html`
    <div class="Grid Grid--withGutter">
      <div class="Grid-cell u-md-size1of4 u-lg-size1of4">
        <img class="Booklist-cover--listview" src="${cover.url}">
      </div>
      <div class="Grid-cell u-md-size3of4 u-lg-size3of4">
        <div class="Text">
          <h3>${title}</h3>
          <p>${authorYear}</p>
          <p class="Text-bold">Illustratör</p>
          <p>${abstract}</p>
        </div>
      </div>
    </div>
  `
}
