'use strict'

const Router = require('koa-router')
const { getLang } = require('../locale')
const fs = require('fs')

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

router.post(process.env.PRISMIC_HOOK_URL,
  async function (ctx, next) {
    if (ctx.request.body && ctx.request.body.secret === process.env.PRISMIC_HOOK_SECRET) {
      clearCache()
      ctx.status = 200
    } else {
      ctx.status = 401
    }
  }
)

function clearCache () {
  fs.writeFileSync('./cache.json', '{}')
}
