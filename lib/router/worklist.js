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

/**
 * Hard efine list page URLs
 * TODO: change into using ctx.params when there's time to figure how to pass route on to page router if not match
 */
var UIDS = {
  books: __('booklist'),
  movies: __('movielist')
}
router.get(`/:langCode/${UIDS.books}`, listpage(UIDS.books))
router.get(`/:langCode/${UIDS.movies}`, listpage(UIDS.movies))

function listpage (uid) {
  return async function listpage (ctx, next) {
    ctx.state.uid = uid
    ctx.view = 'listpage'
    const lang = getLang(ctx.params.langCode)
    const doc = await ctx.prismic.getByUID('listpage', uid, { lang: lang })
    ctx.state.pages.items.push(doc)
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.title = asText(doc.data.title)
    var reqQuery = ctx.request.query
    ctx.state.requestQuery = reqQuery

    var docType = uid === UIDS.books ? 'book' : 'movie'
    ctx.state.docType = docType
    var workFilter = {
      empty: doc.data.empty,
      viewBy: getViewBy(reqQuery, doc.data.default_view),
      sortBy: getSortBy(reqQuery, doc.data.default_sort_by, docType),
      orderBy: getOrderBy(reqQuery),
      options: doc.data.filter_options,
      listOptions: getListOptions(docType)
    }
    ctx.state.ui.workFilter = workFilter

    // get options
    const orderings = getOrderings(reqQuery, workFilter.sortBy, docType)

    // get predicates and optional post filters
    const {
      predicates,
      postFilters
    } = buildQuery(reqQuery, createPropHandlers(docType))
    const queryOptions = {
      lang,
      orderings,
      fetchLinks: 'page.title'
    }
    console.log(queryOptions)

    // query prismic with predicates from query and optinal post request filter
    const worksQuery = await ctx.prismic.query([
      Prismic.Predicates.at('document.type', docType),
      ...predicates
    ], queryOptions).then(postFilters)

    // Update state for views
    ctx.state[docType + 's'] = worksQuery.results || []
    // ctx.state.books = worksQuery.results || []

    // get the rest
    await getRefs(doc, ctx)
    await getMetadata(doc, ctx, next)
    await fetchSubnavigation(doc, ctx, next)
    await updateNavigation(doc, ctx, next)
    await next()
  }
}

/**
 * Returns a prop handler for prismic data props
 */
function createPropHandlers (type) {
  return {
    'text': fullTextGetter(),
    'tags': tagsGetter(),
    'type': simplePropGetter(type, 'type'),
    'directors': stringListGetter(type, 'authors'),
    'authors': stringListGetter(type, 'authors'),
    'content': simplePropGetter(type, 'content'),
    'illustrators': stringListGetter(type, 'illustrators'),
    'publicist': simplePropGetter(type, 'publicist'),
    'character': simplePropGetter(type, 'character')
  }
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
 * Creates a function that validates against a value within a string list
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
 * Creates a function that validates based on an array of tags
 * @return {Function}  A function that takes an array of tags and queries for it within
 */
function tagsGetter () {
  return function tagsQuery (tags) {
    tags = typeof tags === 'string' ? [tags] : tags
    return {
      predicates: [Prismic.Predicates.at('document.tags', tags)]
    }
  }
}

/**
 * Creates a function that searches documents in text and select-fields
 * @return {Function}  A function that takes a string and does a full text search within documents
 */
function fullTextGetter () {
  return function fullTextSearch (text = '') {
    return {
      predicates: [Prismic.Predicates.fulltext('document', text)]
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
function buildQuery (query, propHandlers) {
  var options = [
    ...Object.entries(query)
    .map(pair => constructFilter(pair, propHandlers))
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
function constructFilter ([name, value], propHandlers = {}) {
  var emptyFilter = {predicates: []}
  if (!value) return emptyFilter
  var filterGenerator = propHandlers[name]
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
function getOrderings (query, sortBy, type) {
  var orderBy = getOrderBy(query)
  // We don't need it in query if it's Prismic default
  if (orderBy === 'asc') orderBy = ''
  if (type === 'book') {
    if (sortBy === 'book_title') {
      return `[my.book.book_title ${orderBy}, my.book.author_year ${orderBy}]`
    }
    return `[my.book.author_year ${orderBy}, my.book.book_title ${orderBy}]`
  } else if (type === 'movie') {
    if (sortBy === 'movie_title') {
      return `[my.movie.movie_title ${orderBy}, my.movie.published_year ${orderBy}]`
    }
    return `[my.movie.published_year ${orderBy}, my.movie.movie_title ${orderBy}]`
  }
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
function getViewBy (query, defaultView, type) {
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
function getSortBy (query, defaultSortBy, type) {
  if (type === 'book') {
    if (query.sort_by === 'book_title' || (!query.sort_by && defaultSortBy === 'Titel')) {
      return 'book_title'
    }
    return 'author_year'
  } else if (type === 'movie') {
    if (query.sort_by === 'movie_title' || (!query.sort_by && defaultSortBy === 'Titel')) {
      return 'movie_title'
    }
    return 'published_year'
  }
}

function getListOptions (type) {
  if (type === 'book') {
    return {
      left: [
        {
          header: __('list by'),
          items: [
            [
              {
                label: __('chronologically'),
                id: 'sortByAuthorYear',
                name: 'sort_by',
                value: 'author_year'
              },
              {
                label: __('alphabetically'),
                id: 'sortByTitle',
                name: 'sort_by',
                value: 'book_title'
              }
            ]
          ]
        }
      ],
      right: [
        {
          header: __('view by'),
          items: [
            [
              {
                label: __('list'),
                id: 'viewByList',
                name: 'view_by',
                value: 'list'
              },
              {
                label: __('cover'),
                id: 'viewByGrid',
                name: 'view_by',
                value: 'grid'
              }
            ]
          ]
        }
      ]
    }
  } else if (type === 'movie') {
    return {
      left: {
        header: __('list by'),
        groups: [
          {
            items: [
              [
                {
                  label: __('chronologically'),
                  id: 'sortByAuthorYear',
                  name: 'sort_by',
                  value: 'published_year'
                },
                {
                  label: __('alphabetically'),
                  id: 'sortByTitle',
                  name: 'sort_by',
                  value: 'movie_title'
                }
              ]
            ]
          }
        ]
      },
      right: {
        header: __('view by'),
        groups: [
          {
            items: [
              [
                {
                  label: __('list'),
                  id: 'viewByList',
                  name: 'view_by',
                  value: 'list'
                },
                {
                  label: __('cover'),
                  id: 'viewByGrid',
                  name: 'view_by',
                  value: 'grid'
                }
              ]
            ]
          }
        ]
      }
    }
  }
}
