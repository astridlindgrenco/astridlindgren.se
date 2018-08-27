'use strict'

const Router = require('koa-router')
const {__, getCode} = require('../locale')
const getRefs = require('./helpers/getRefs')
const router = module.exports = new Router()

router.get('/' + __('newsdesk'),
  async function (ctx, next) {
    ctx.view = 'newsdesk'

    const langCode = getCode(ctx.state.lang)
    const options = { lang: langCode }
    const doc = await ctx.prismic.getSingle('mynewsdesk', options)

    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title
    ctx.state.url = '/newsdesk'
    await getRefs(doc.data, ctx)
    await next()
  }
)
