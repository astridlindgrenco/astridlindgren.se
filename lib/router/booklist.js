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
const Prismic = require('prismic-javascript')
const { asText } = require('prismic-richtext')
const {__, getLang} = require('../locale')
const { pipe } = require('../components/base/utils')
const getRefs = require('./helpers/getRefs')
const getMetadata = require('./helpers/getMetadata')
const fetchSubnavigation = require('./helpers/fetchSubnavigation')
const updateNavigation = require('./helpers/updateNavigation')

const router = module.exports = new Router()

router.get(`/:langCode/${__('booklist')}`,
  async function (ctx, next) {
    ctx.view = 'booklist'
    const lang = getLang(ctx.params.langCode)
    // get page
    const doc = await ctx.prismic.getSingle('booklist', { lang: lang })
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = asText(doc.data.title)
    ctx.state.requestQuery = ctx.request.query
    var reqQuery = ctx.state.requestQuery

    /**
     * Filtering stuff
     */
    const filterOptions = doc.data.filter_options

    // get options
    const orderings = getOrderings(reqQuery, doc.data.default_sort_by)

    // get predicates
    const queryOptions = getFilterOptions(reqQuery, ['view_by', 'sort_by'])
    const bookOptions = {
      lang,
      orderings,
      fetchLinks: 'page.title'
    }

    // query prismic with predicates from query and optinal post request filter
    const booksQuery = await ctx.prismic.query([
      Prismic.Predicates.at('document.type', 'book'),
      ...queryOptions.predicates
    ], bookOptions).then(queryOptions.postFilters)

    // Update state for views
    ctx.state.books = booksQuery.results || []
    ctx.state.ui.bookFilter = {
      viewBy: getViewBy(reqQuery, doc.data.default_view),
      sortBy: getSortBy(reqQuery, doc.data.default_sort_by),
      options: filterOptions
    }

    // get the rest
    await getRefs(doc, ctx)
    await getMetadata(doc, ctx, next)
    await fetchSubnavigation(doc, ctx, next)
    await updateNavigation(doc, ctx, next)
    await next()
  }
)

var bookFilters = {
  'type': simplePropGetter('book', 'type'),
  'author': simplePropGetter('book', 'author'),
  'content': simplePropGetter('book', 'content'),
  'illustrators': simplePropGetter('book', 'illustrators'),
  'publicist': simplePropGetter('book', 'publicist'),
  'character': simplePropGetter('book', 'character')
}

/**
 * Returns a function that expects a value to query for
 * @param  {String} type Prismic Custom Type API ID
 * @param  {String} prop Prismic property API ID
 * @return {Function}    A function that takes a value and queries for it
 */
function simplePropGetter (type, prop) {
  return function getPropFrom (value) {
    return {predicates: [Prismic.Predicates.at(`my.${type}.${prop}`, value)]}
  }
}

/**
 * Builds predicates and filter functions based on a Koa query object
 * @param  {Object} query  A key value pair parsed from URL query string
 * @return {Array}         An array of predicates
 */
function getFilterOptions (query) {
  var options = [
    ...Object.entries(query)
    .map(pair => getFilter(...pair))
  ]
  return {
    predicates: options.map(filter => filter.predicates),
    // Create pipe of postfilters to be run after request
    postFilters: pipe(
      ...options
      .map(filter => filter.postFilter)
      .filter(Boolean)
    )
  }
}

/**
 * Creates predicate and filter functions for given query filter param
 * @param  {String} name  The query param key
 * @param  {String} value The query param value
 * @return {Array}        Array of predicate and optionally filter to be run after request
 */
function getFilter (name, value) {
  var emptyFilter = {predicates: []}
  if (!value) return emptyFilter
  var filterGenerator = bookFilters[name]
  if (typeof filterGenerator === 'function') {
    return filterGenerator(value)
  } else return emptyFilter
}

function getOrderings (query, sortBy) {
  const orderBy = query.sort_by && query.sort_by === 'desc' ? 'desc' : ''
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
  if (query.sort_by === 'book_title' || (!query.sort_by && defaultSortBy === 'Boktitel')) {
    return 'book_title'
  }
  return 'author_year'
}
