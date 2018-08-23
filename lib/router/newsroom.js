'use strict'

const Router = require('koa-router')
const render = require('../render')
const locale = require('../locale')
const getRefs = require('./helpers/getRefs')
const router = module.exports = new Router()

router.get('/newsdesk',
  async function (ctx, next) {
    const langCode = locale.getCode(ctx.state.lang)
    const options = { lang: langCode }
    console.log('mynewsdesk', options)
    const doc = await ctx.prismic.getSingle('mynewsdesk', options)
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    console.log(doc)
    ctx.state.title = doc.data.title
    ctx.state.url = '/newsdesk'
    await getRefs(doc, ctx)
    await next()
  },
  render(require('../views/newsroom'))
)
