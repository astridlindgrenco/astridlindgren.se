'use strict'

const Router = require('koa-router')
const render = require('../render')
const locale = require('../locale')
const fetchLinks = require('./helpers/fetchLinks')
const getRefs = require('./helpers/getRefs')
const fetchSubnavigation = require('./helpers/fetchSubnavigation')
const updateNavigation = require('./helpers/updateNavigation')

const router = module.exports = new Router()

router.get('/:path/:sub_path?',
  async function (ctx, next) {
    const uid = ctx.params.sub_path || ctx.params.path
    const langCode = locale.getCode(ctx.state.lang)
    const options = { lang: langCode }
    console.log('page', uid, options)
    const doc = await ctx.prismic.getByUID('page', uid, options)
    ctx.assert(doc, 404, `404 NOT FOUND ${uid}`)
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title ? doc.data.title[0].text : 'Rubrik saknas'
    ctx.state.uid = uid
    ctx.state.url = '/' + ctx.params.sub_path + '/' + (ctx.params.path || '')
    await fetchLinks(doc, ctx, next)
    await getRefs(doc, ctx)
    await fetchSubnavigation(doc, ctx, next)
    await updateNavigation(doc, ctx, next)
    await next()
  },
  render(require('../views/page'))
)
