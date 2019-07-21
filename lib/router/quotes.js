'use strict'

const Prismic = require('prismic-javascript')
const { asText } = require('prismic-richtext')
const Router = require('koa-router')
const { __ } = require('../locale')
const getRefs = require('./helpers/getRefs')
const { parseQuery } = require('./../components/sorting/queryReader')
const router = module.exports = new Router()

router.get(`/:locale/:quotes`,
  async function (ctx, next) {
    if (ctx.view) return next()
    if (ctx.params.quotes !== __('quotes')) return next()
    const lang = ctx.state.lang
    const options = { lang: lang }
    const doc = await ctx.prismic.getByUID('listpage', __('quotes'), options)
    if (!doc) return next()
    ctx.view = 'listpage'
    ctx.state.uid = __('quotes')
    ctx.state.docType = 'quote'

    // Get and store request query
    var reqQuery = ctx.request.query
    ctx.state.requestQuery = reqQuery

    ctx.state.doc = doc
    ctx.state.title = asText(doc.data.title)

    // Get quotes
    var quotePredicates = [
      Prismic.Predicates.at('document.type', 'quote')
    ]
    if (reqQuery.tags) {
      quotePredicates.push(Prismic.Predicates.at('document.tags', [reqQuery.tags.trim()]))
    }
    const quotes = await ctx.prismic.query(quotePredicates, {
      lang,
      pageSize: 100, /** TODO: This is maximum, we need paging and to use page option in the long run */
      orderings: '[document.last_publication_date]',
      ref: ctx.state.ref
    })
    ctx.state.quotes = quotes.results

    // Create filter configuration for Filter component
    ctx.state.ui.workFilter = {
      options: [{
        label: __('Kategori'),
        api_id: 'tags',
        default_option: __('All'),
        reset_label: __('All')
      }],
      empty: 'doc.data.empty'
    }

    ctx.state.sorting_options = parseQuery(ctx.request.query)
    ctx.state.sorting_options.hide_view = true

    await getRefs(doc.data, ctx)

    return next()
  }
)
