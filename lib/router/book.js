'use strict'

const Router = require('koa-router')
const { __ } = require('../locale')

const router = module.exports = new Router()

router.get(`/:locale/:book/:uid`,
  async function (ctx, next) {
    if (ctx.view) return next()
    if (ctx.params.book !== __('book')) return next()
    const options = { lang: ctx.state.lang }
    const doc = await ctx.prismic.getByUID('book', ctx.params.uid, options)
    if (!doc) return next()
    ctx.view = 'book'
    ctx.state.params = [__('booklist')]
    ctx.state.doc = doc
    ctx.state.title = doc.data.book_title[0] ? doc.data.book_title[0].text : '?title'

    return next()
  }
)
