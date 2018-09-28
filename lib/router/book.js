'use strict'

const Router = require('koa-router')
const {__} = require('../locale')
const getRefs = require('./helpers/getRefs')
const getMetadata = require('./helpers/getMetadata')
const fetchSubnavigation = require('./helpers/fetchSubnavigation')
const updateNavigation = require('./helpers/updateNavigation')

const router = module.exports = new Router()

router.get(`/:locale/:book/:uid`,
  async function (ctx, next) {
    if (ctx.params.book !== __('book')) return next()
    ctx.view = 'book'
    ctx.state.params = [__('booklist')]
    // get page
    const options = { lang: ctx.state.lang }
    const doc = await ctx.prismic.getByUID('book', ctx.params.uid, options)
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.book_title[0] ? doc.data.book_title[0].text : '?title'

    // get the rest
    await getRefs(doc.data, ctx)
    try {
      let metadata = getMetadata(doc, ctx, next)
      let subnavigation = fetchSubnavigation(doc, ctx, next)
      let navigation = updateNavigation(doc, ctx, next)
      await Promise.all([metadata, subnavigation, navigation])
    } catch (ex) {
      console.log('[Page] threw: ' + JSON.stringify(ex))
    }
    await next()
  }
)
