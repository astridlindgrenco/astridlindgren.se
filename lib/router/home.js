'use strict'

const Router = require('koa-router')
const render = require('../render')
const locale = require('../locale')
const fetchLinks = require('./helpers/fetchLinks')
const getRefs = require('./helpers/getRefs')

const router = module.exports = new Router()

router.get('/',
  async function (ctx, next) {
    const langCode = locale.getCode(ctx.state.lang)
    const options = { lang: langCode }
    const doc = await ctx.prismic.getSingle('home', options)
    ctx.assert(doc, 500, 'Content missing')
    await fetchLinks(doc, ctx, next)
    await getRefs(doc, ctx)

    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title[0].text
    await next()
  },
  render(require('../views/home'))
)
