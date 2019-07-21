'use strict'

const Router = require('koa-router')
const { __ } = require('../locale')
const getRefs = require('./helpers/getRefs')
const getMetadata = require('./helpers/getMetadata')
const router = module.exports = new Router()

router.get(`/:locale/:newsdesk`,
  async function (ctx, next) {
    if (ctx.view) return next()
    if (ctx.params.newsdesk !== __('newsdesk')) return next()
    const options = { lang: ctx.state.lang }
    const doc = await ctx.prismic.getSingle('newsdesk', options)
    if (!doc) return next()
    ctx.view = 'newsdesk'
    ctx.state.doc = doc
    ctx.state.title = doc.data.title

    await getRefs(doc.data, ctx)

    getMetadata(doc, ctx, next)

    return next()
  }
)
