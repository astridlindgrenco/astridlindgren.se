'use strict'

const Router = require('koa-router')
const {__, getCode} = require('../locale')
const getRefs = require('./helpers/getRefs')
const fetchSubnavigation = require('./helpers/fetchSubnavigation')
var Prismic = require('prismic-javascript')

const router = module.exports = new Router()

router.get('/' + __('booklist'),
  async function (ctx, next) {
    ctx.view = 'booklist'

    const langCode = getCode(ctx.state.lang)
    // get page
    const bookListOptions = { lang: langCode }
    const doc = await ctx.prismic.getSingle('booklist', bookListOptions)
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title[0].text
    // get books
    // TODO read selected sort order or use default sort order
    const bookOptions = { lang: langCode, orderings: '[my.book.author_year, my.book.book_title]' } // { lang: langCode, orderings: '[my.book.book_title]' }
    const booksQuery = await ctx.prismic.query([
      Prismic.Predicates.at('document.type', 'book')
    ], bookOptions)
    ctx.state.books = booksQuery.results || []
    // get the rest
    await getRefs(doc, ctx)
    await fetchSubnavigation(doc, ctx, next)
    await next()
  }
)
