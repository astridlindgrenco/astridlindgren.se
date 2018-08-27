'use strict'

const Router = require('koa-router')
const { __, getLang } = require('../locale')
const getRefs = require('./helpers/getRefs')
const router = module.exports = new Router()

router.get(`/:langCode/${__('newsdesk')}`,
  async function (ctx, next) {
    ctx.view = 'newsdesk'
    const lang = getLang(ctx.params.langCode)
    const options = { lang: lang }
    const doc = await ctx.prismic.getSingle('mynewsdesk', options)

    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title
    await getRefs(doc.data, ctx)
    await next()
  }
)
