'use strict'

const Router = require('koa-router')
const { getLang } = require('../locale')

const router = module.exports = new Router()

router.get('/:langCode/sitemap',
  async function (ctx, next) {
    if (ctx.view) return next()
    ctx.view = 'sitemap'

    if (!ctx.state.lang) ctx.state.lang = getLang(ctx.params.langCode)

    ctx.state.title = 'Sitemap'
    ctx.state.params = []
    await next()
  }
)
