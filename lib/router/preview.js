'use strict'

const Router = require('koa-router')
const router = module.exports = new Router()
const Prismic = require('prismic-javascript')
const linkResolver = require('../resolve.js')

router.get('/preview', async function (ctx, next) {
  const token = ctx.request.query.token
  const url = await ctx.prismic.previewSession(token, async (res) => {
    return linkResolver(res, ctx)
  }, '/')
  console.log('[Preview] token:', token, 'url:', url)
  ctx.cookies.set(Prismic.previewCookie, token, { maxAge: 30 * 60 * 1000, path: '/', httpOnly: false })

  ctx.redirected = true
  ctx.redirect(url)
})
