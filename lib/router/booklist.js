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
const getMetadata = require('./helpers/getMetadata')
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
    ctx.state.viewBy = getViewBy(ctx.request.query, doc.data.default_view)
    ctx.state.sortBy = getSortBy(ctx.request.query, doc.data.default_sort_by)
    // get books
    const orderings = getOrderings(ctx.request.query, ctx.state.sortBy)
    // TODO add filter
    const bookOptions = { lang: lang, orderings: orderings }
    const booksQuery = await ctx.prismic.query([
      Prismic.Predicates.at('document.type', 'book')
    ], bookOptions)
    ctx.state.books = booksQuery.results || []

    // get the rest
    await getRefs(doc, ctx)
    await getMetadata(doc, ctx, next)
    await fetchSubnavigation(doc, ctx, next)
    await next()
  }
)

function getOrderings (query, sortBy) {
  const orderBy = query.order_by && query.order_by === 'desc' ? 'desc' : ''
  if (sortBy === 'book_title') {
    return `[my.book.book_title ${orderBy}, my.book.author_year ${orderBy}]`
  }
  return `[my.book.author_year ${orderBy}, my.book.book_title ${orderBy}]`
}

function getViewBy (query, defaultView) {
  if (query.view_by === 'grid' || (!query.view_by && defaultView === 'Rutnät')) {
    return 'grid'
  }
  return 'list'
}

function getSortBy (query, defaultSortBy) {
  console.log(query.sort_by, defaultSortBy)
  if (query.sort_by === 'book_title' || (!query.sort_by && defaultSortBy === 'Boktitel')) {
    return 'book_title'
  }
  return 'author_year'
}
