'use strict'

/**
 * Responsible for handling requests for the Booklist,
 * sorting and filtering of books by query parameters.
 *
 * Sorting is specified in order from left to right
 *   'sort_by' + '=' + prismic field name
 *   'order_by' + '=' + 'asc'|'desc'.
 * Default is by author_year asc then book_title asc.
 *
 * Filtering is specified by
 *   'filter_' + prismic field name + '=' + value.
 */

const Router = require('koa-router')
const {__, getLang} = require('../locale')
const getRefs = require('./helpers/getRefs')
const fetchSubnavigation = require('./helpers/fetchSubnavigation')
const Prismic = require('prismic-javascript')

const router = module.exports = new Router()

router.get(`/:langCode/${__('booklist')}`,
  async function (ctx, next) {
    ctx.view = 'booklist'
    const lang = getLang(ctx.params.langCode)
    // get page
    const bookListOptions = { lang: lang }
    const doc = await ctx.prismic.getSingle('booklist', bookListOptions)
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title[0].text
    ctx.state.defaultView = doc.data.default_view
    // get books
    const orderings = getOrderings(ctx.request.query)
    // TODO add filter
    const bookOptions = { lang: lang, orderings: orderings }
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

function getOrderings (query) {
  const sortBy = query.order_by && query.order_by === 'desc' ? 'desc' : ''
  if (query.sort_by && query.sort_by === 'book_title') {
    return `[my.book.book_title ${sortBy}, my.book.author_year ${sortBy}]`
  }
  return `[my.book.author_year ${sortBy}, my.book.book_title ${sortBy}]`
}
