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
    var reqQuery = ctx.request.query
    ctx.state.requestQuery = reqQuery
    var bookFilter = {
      viewBy: getViewBy(reqQuery, doc.data.default_view),
      sortBy: getSortBy(reqQuery, doc.data.default_sort_by),
      orderBy: getOrderBy(reqQuery),
      options: doc.data.filter_options
    }
    ctx.state.ui.bookFilter = bookFilter

    // get options
    const orderings = getOrderings(reqQuery, bookFilter.sortBy)

    // get predicates and optional post filters
    const {
      predicates,
      postFilters
    } = buildQuery(reqQuery)
    const queryOptions = {
      lang,
      orderings,
      fetchLinks: 'page.title'
    }

    // query prismic with predicates from query and optinal post request filter
    const booksQuery = await ctx.prismic.query([
      Prismic.Predicates.at('document.type', 'book'),
      ...predicates
    ], queryOptions).then(postFilters)

    // Update state for views
    ctx.state.books = booksQuery.results || []

    // get the rest
    await getRefs(doc, ctx)
    await getMetadata(doc, ctx, next)
    await fetchSubnavigation(doc, ctx, next)
    await updateNavigation(doc, ctx, next)
    await next()
  }
)

/**
 * Configure what query builder function that goes with a request query param
 * Example:  "foo" in ?type=foo" get's sent to handler returned by simplePropGetter
 */
var bookFilters = {
  'type': simplePropGetter('book', 'type'),
  'authors': stringListGetter('book', 'authors'),
  'content': simplePropGetter('book', 'content'),
  'illustrators': stringListGetter('book', 'illustrators'),
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
  return function simplePred (value) {
    return {predicates: [Prismic.Predicates.at(`my.${type}.${prop}`, value)]}
  }
}

/**
 * Creates a function that get's a value that may be a string list
 * Example: "John" is found in "John, Mary, Amir" or "John and Mary"
 * @param  {String} type        Prismic Custom Type API ID
 * @param  {String} prop        Prismic property API ID
 * @param  {String} separator   A character that is used to separate items in string list.
 * @return {Function}           A function that takes a value and queries for it within a string list
 */
function stringListGetter (type, prop, separator) {
  return function predAndPostFilter (value) {
    return {
      predicates: [Prismic.Predicates.has(`my.${type}.${prop}`)],
      postFilter: function findInStringList (response) {
        response.results = response.results.filter(doc => inStringList(separator, value, doc.data[prop]))
        return response
      }
    }
  }
}

/**
 * Checks if a value is present within a string list
 * @param  {String} [separator=','] A character that is used to separate items in string list. Defaults to comma (,)
 * @param  {String} val             A value to search for within list
 * @param  {String} str             String to split into items
 * @return {Boolean}                True if val is found within list
 */
function inStringList (separator = ',', val, str) {
  return str.split(separator).map(str => str.trim().toLowerCase()).indexOf(val.toLowerCase()) !== -1
}

/**
 * Builds predicates and filter functions based on a Koa query object
 * @param  {Object} query  A key value pair parsed from URL query string
 * @return {Array}         An array of predicates
 */
function buildQuery (query) {
  var options = [
    ...Object.entries(query)
    .map(pair => constructFilter(...pair))
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
function constructFilter (name, value) {
  var emptyFilter = {predicates: []}
  if (!value) return emptyFilter
  var filterGenerator = bookFilters[name]
  if (typeof filterGenerator === 'function') {
    return filterGenerator(value)
  } else return emptyFilter
}

/**
 * Get's orderings for Prismic query
 * @param  {Object} query  Koa request query object
 * @param  {String} sortBy The current sort setting
 * @return {String}        Prismic Predicate for orderings
 */
function getOrderings (query, sortBy) {
  var orderBy = getOrderBy(query)
  // We don't need it in query if it's Prismic default
  if (orderBy === 'asc') orderBy = ''
  if (sortBy === 'book_title') {
    return `[my.book.book_title ${orderBy}, my.book.author_year ${orderBy}]`
  }
  return `[my.book.author_year ${orderBy}, my.book.book_title ${orderBy}]`
}

/**
 * Get's page view list order
 * @param  {Object} query       Koa request query object
 * @param  {String} defaultView The default view setting of the page
 * @return {String}             View config key for used for layout
 */
function getOrderBy (query) {
  return query.order_by && query.order_by === 'desc' ? 'desc' : 'asc'
}

/**
 * Get's page view layout
 * @param  {Object} query       Koa request query object
 * @param  {String} defaultView The default view setting of the page
 * @return {String}             View config key for used for layout
 */
function getViewBy (query, defaultView) {
  if (query.view_by === 'grid' || (!query.view_by && defaultView === 'Rutnät')) {
    return 'grid'
  }
  return 'list'
}

/**
 * Get's Prismic field API ID key to use for ordering results
 * @param  {Object} query         Koa request query object
 * @param  {String} defaultSortBy The default sorting setting of the page
 * @return {String}               Prismic field API ID
 */
function getSortBy (query, defaultSortBy) {
  if (query.sort_by === 'book_title' || (!query.sort_by && defaultSortBy === 'Boktitel')) {
    return 'book_title'
  }
  return 'author_year'
}
