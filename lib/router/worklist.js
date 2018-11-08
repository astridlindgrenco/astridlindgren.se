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
const { __ } = require('../locale')
const { pipe } = require('../components/base/utils')
const getRefs = require('./helpers/getRefs')
const getMetadata = require('./helpers/getMetadata')
const updateNavigation = require('./helpers/updateNavigation')
const createPropHandlers = require('./helpers/prismicPropHandlers')

const router = module.exports = new Router()

router.get(`/:locale/:works/:list`,
  async function (ctx, next) {
    if (ctx.view) return next()
    if (ctx.params.works === __('the works')) {
      if (ctx.params.list === __('booklist')) return listpage(ctx, next, 'book')
      if (ctx.params.list === __('movielist')) return listpage(ctx, next, 'movie')
    }
    return next()
  }
)

async function listpage (ctx, next, docType) {
  ctx.state.uid = ctx.params.list
  const options = { lang: ctx.state.lang }
  const doc = await ctx.prismic.getByUID('listpage', ctx.state.uid, options)
  if (!doc) return next()
  ctx.view = 'listpage'
  ctx.state.pages.items.push(doc)
  ctx.state.title = asText(doc.data.title)

  // Get and store request query
  var reqQuery = ctx.request.query
  ctx.state.requestQuery = reqQuery

  // Save listed type of Prismic documents
  ctx.state.docType = docType

  // Sort out sorting and orderings etc
  var viewBy = getViewBy(reqQuery, doc.data.default_view)
  var sortBy = getSortBy(reqQuery, doc.data.default_sort_by, docType)
  var orderBy = getOrderBy(reqQuery)

  // Create filter configuration for Filter component
  ctx.state.ui.workFilter = {
    options: doc.data.filter_options,
    empty: doc.data.empty,
    // Options for sorting and changing view type
    sortingOptions: getListOptions(docType, viewBy, sortBy, orderBy),
    viewBy,
    sortBy,
    orderBy
  }

  // get predicates and optional post filters
  const {
    predicates,
    postFilters
  } = buildQuery(reqQuery, docType)
  const queryOptions = {
    lang: ctx.state.lang,
    page: 1,
    pageSize: 100,
    orderings: getOrderings(reqQuery, sortBy, docType),
    fetchLinks: 'page.title',
    ref: ctx.state.ref
  }

  // Query prismic with predicates from query and optional post request filter
  const worksQueryResponses = await queryAllDocsRecurr(ctx, docType, predicates, queryOptions, postFilters)
  // Update state with documents for view
  ctx.state[docType + 's'] = [].concat(...worksQueryResponses.map(response => response.results)) || []

  // get the rest
  await Promise.all([
    getRefs(doc, ctx),
    getMetadata(doc, ctx, next),
    updateNavigation(doc, ctx, next)
  ])
  return next()
}

/**
 * Builds predicates and filter functions based on a Koa query object
 * @param  {Object} query  A key value pair parsed from URL query string
 * @return {Array}         An array of predicates
 */
function buildQuery (query, docType) {
  var propHandlers = createPropHandlers(docType)
  var options = [
    ...Object.entries(query)
    .map(pair => constructPredicateAndFilter(pair, propHandlers))
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

async function queryAllDocsRecurr (ctx, docType, predicates, queryOptions, postFilters, responses = []) {
  return ctx.prismic.query([
    Prismic.Predicates.at('document.type', docType),
    ...predicates
  ], queryOptions)
  .then(function handleOptionalRecurr (response) {
    if (response.next_page !== null) {
      return queryAllDocsRecurr(ctx, docType, predicates, Object.assign(queryOptions, { page: queryOptions.page + 1 }), postFilters, responses.concat(response))
    }
    // When all pages have been fetched return it all
    return responses.concat(response)
  })
  .then(postFilters)
}

/**
 * Creates predicate and filter functions for given query filter param
 * @param  {String} name  The query param key
 * @param  {String} value The query param value
 * @return {Array}        Array of predicate and optionally filter to be run after request
 */
function constructPredicateAndFilter ([name, value], propHandlers = {}) {
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

function getListOptions (type, viewBy, sortBy, orderBy) {
  if (type === 'book') {
    return {
      left: {
        header: __('list by'),
        groups: [
          {
            items: [
              [
                {
                  label: __('chronologically'),
                  isChecked: sortBy === 'author_year',
                  name: 'sort_by',
                  value: 'author_year'
                },
                {
                  label: __('alphabetically'),
                  isChecked: sortBy === 'book_title',
                  name: 'sort_by',
                  value: 'book_title'
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
                  isChecked: viewBy === 'list',
                  name: 'view_by',
                  value: 'list'
                },
                {
                  label: __('cover'),
                  isChecked: viewBy === 'grid',
                  name: 'view_by',
                  value: 'grid'
                }
              ]
            ]
          }
        ]
      }
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
                  isChecked: sortBy === 'published_year',
                  id: 'sortByAuthorYear',
                  name: 'sort_by',
                  value: 'published_year'
                },
                {
                  label: __('alphabetically'),
                  isChecked: sortBy === 'movie_title',
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
                  isChecked: viewBy === 'list',
                  name: 'view_by',
                  value: 'list'
                },
                {
                  label: __('cover'),
                  isChecked: viewBy === 'grid',
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
