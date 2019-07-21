'use strict'

const Router = require('koa-router')
const getRefs = require('./helpers/getRefs')

const router = module.exports = new Router()

router.get('/', async function (ctx) {
  ctx.redirected = true
  ctx.redirect(`/${ctx.state.locale}`)
})

router.get('/:locale',
  async function (ctx, next) {
    let homePattern = /^\/(sv|en|de)(\/?$|\?)/
    if (!homePattern.exec(ctx.req.url)) return next()
    if (ctx.view) return next()
    ctx.view = 'home'
    const options = { lang: ctx.state.lang }
    const doc = await ctx.prismic.getSingle('home', options)
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.doc = doc
    ctx.state.title = doc.data.title[0].text
    ctx.state.params = []

    await getRefs(doc.data, ctx)

    return next()
  }
)
