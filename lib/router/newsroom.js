'use strict'

const Router = require('koa-router')
const render = require('../render')
const locale = require('../locale')
const getRefs = require('./helpers/getRefs')
const router = module.exports = new Router()

router.get('/:path/:sub_path?',
  async function (ctx, next) {
    const uid = ctx.params.sub_path || ctx.params.path
    const langCode = locale.getCode(ctx.state.lang)
    const options = { lang: langCode }
    console.log('mynewsdesk', uid, options)
    const doc = await ctx.prismic.getByUID('mynewsdesk', uid, options)
    if (!doc) return null
    console.log(1)
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title[0].text
    await getRefs(doc, ctx)
    await next()
  },
  (ctx) => {
    if (ctx.state.pages.items.find(doc => doc.type === 'mynewsdesk')) {
      console.log(2)
      render(require('../views/newsroom'))
    }
  }
)
