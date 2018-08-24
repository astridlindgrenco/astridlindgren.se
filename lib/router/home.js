'use strict'

const Router = require('koa-router')
const locale = require('../locale')
const getRefs = require('./helpers/getRefs')

const router = module.exports = new Router()

router.get('/',
  async function (ctx, next) {
    ctx.view = 'home'

    const langCode = locale.getCode(ctx.state.lang)
    const options = { lang: langCode }
    const doc = await ctx.prismic.getSingle('home', options)
    ctx.assert(doc, 500, 'Content missing')

    await getRefs(doc.data, ctx)
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title[0].text
    ctx.state.url = '/'

    await next()
  }
)
