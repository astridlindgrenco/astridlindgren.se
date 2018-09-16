'use strict'

const Router = require('koa-router')

const router = module.exports = new Router()

router.get('/:locale/sitemap',
  async function (ctx, next) {
    if (ctx.view) return next()
    ctx.view = 'sitemap'
    ctx.state.title = 'Sitemap'
    ctx.state.params = []
    await next()
  }
)

router.post(process.env.PRISMIC_HOOK_URL,
  async function (ctx, next) {
    console.log(ctx.request.body)
    if (ctx.request.body && ctx.request.body.secret === process.env.PRISMIC_HOOK_SECRET) {
      ctx.db.flushAll()
      ctx.status = 200
    } else {
      ctx.status = 401
    }
  }
)
