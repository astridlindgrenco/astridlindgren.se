'use strict'

const Router = require('koa-router')
const {__} = require('../locale')
const getRefs = require('./helpers/getRefs')
const getMetadata = require('./helpers/getMetadata')

const router = module.exports = new Router()

router.get(`/:locale/${__('book')}/:uid`,
  async function (ctx, next) {
    ctx.view = 'book'
    // get page
    const options = { lang: ctx.state.lang }
    const doc = await ctx.prismic.getByUID('book', ctx.params.uid, options)
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.book_title[0] ? doc.data.book_title[0].text : '?title'

    // get the rest
    await getRefs(doc.data, ctx)
    await getMetadata(doc, ctx, next)
    await next()
  }
)
