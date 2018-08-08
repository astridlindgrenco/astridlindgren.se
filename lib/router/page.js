'use strict'

const Router = require('koa-router')
const render = require('../render')
const locale = require('../locale')

const router = module.exports = new Router()

router.get('/:path/:sub_path?',
  async function (ctx, next) {
    const uid = ctx.params.sub_path || ctx.params.path
    const langCode = locale.getCode(ctx.state.lang)
    const options = { lang: langCode }
    const doc = await ctx.prismic.getByUID('page', uid, options)
    ctx.assert(doc, 404, `404 NOT FOUND ${uid}`)
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title[0].text
    await next()
  },
  render(require('../views/page'))
)
