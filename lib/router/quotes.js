'use strict'

const Router = require('koa-router')
const { __, getLang } = require('../locale')
const getRefs = require('./helpers/getRefs')
const getMetadata = require('./helpers/getMetadata')
const { parseQuery } = require('./../components/sorting/queryReader')
const router = module.exports = new Router()

router.get(`/:langCode/${__('quotes')}`,
  async function (ctx, next) {
    ctx.view = 'quotes'
    const lang = getLang(ctx.params.langCode)
    const options = { lang: lang }
    const doc = await ctx.prismic.getSingle('citatsida', options)

    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title[0].text

    ctx.state.sorting_options = parseQuery(ctx.request.query)
    ctx.state.sorting_options.hide_view = true

    await getRefs(doc.data, ctx)
    await getMetadata(doc, ctx, next)
    await next()
  }
)
