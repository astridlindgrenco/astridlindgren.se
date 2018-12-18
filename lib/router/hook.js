'use strict'

const Router = require('koa-router')
const router = module.exports = new Router()
const { rebuild } = require('../middleware/linkmap')

router.all('*',
  async function (ctx, next) {
    // clean URL from whitespace noise
    ctx.url = ctx.url.replace(/^[\w\.\+\-\&\?\=]|%0\d|%1\d/g, '')
    // and do some logging when we are here anyway
    ctx.state.ts = Date.now()

    try {
      console.log(`[Hook]: Request is`, ctx.method, ctx.url)
      await next()
    } catch (error) {
      console.error(`[Hook]: `, ctx.method, ctx.url)
      console.error(`[Error]: ` + error)
      ctx.status = 500
    } finally {
      console.log(`[Hook]: Request resolved in ${Date.now() - ctx.state.ts} ms`, ctx.url)
    }
  }
)

router.post(process.env.PRISMIC_HOOK_URL || '/prismic_update',
  async function (ctx, next) {
    console.log('[Linkmap]: Testing secret...')
    if (ctx.request.body && ctx.request.body.secret === process.env.PRISMIC_HOOK_SECRET) {
      console.log('[Linkmap]: Rebuilding sitemap and linkmap...')
      await rebuild(ctx)
      ctx.status = 200
    } else {
      console.log('[Linkmap]: Incorrect secret.')
      ctx.status = 401
    }
  }
)
