'use strict'

const Router = require('koa-router')
const { __ } = require('../locale')
const getRefs = require('./helpers/getRefs')
const getMetadata = require('./helpers/getMetadata')
const router = module.exports = new Router()

router.get(`/:locale/:newsdesk`,
  async function (ctx, next) {
    if (ctx.params.newsdesk !== __('newsdesk')) return next()
    ctx.view = 'newsdesk'
    const options = { lang: ctx.state.lang }
    const doc = await ctx.prismic.getSingle('newsdesk', options)

    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title

    await getRefs(doc.data, ctx)
    await getMetadata(doc, ctx, next)
    await next()
  }
)
