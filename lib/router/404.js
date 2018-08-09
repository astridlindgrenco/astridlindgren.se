'use strict'

const Router = require('koa-router')
const render = require('../render')
const locale = require('../locale')

const router = module.exports = new Router()

router.get('/404',
  async function (ctx, next) {
    const langCode = locale.getCode(ctx.state.lang)
    const options = { lang: langCode }
    const doc = await ctx.prismic.getSingle('404', options)
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title[0].text
    await next()
  },
  render(require('../views/404'))
)
