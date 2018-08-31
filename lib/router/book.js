'use strict'

const Router = require('koa-router')
const {__, getLang} = require('../locale')
const getRefs = require('./helpers/getRefs')
const getMetadata = require('./helpers/getMetadata')
const fetchSubnavigation = require('./helpers/fetchSubnavigation')
const updateNavigation = require('./helpers/updateNavigation')

const router = module.exports = new Router()

router.get(`/:langCode/${__('book')}/:uid`,
  async function (ctx, next) {
    ctx.view = 'book'
    const lang = getLang(ctx.params.langCode)
    // get page
    const options = { lang: lang }
    const doc = await ctx.prismic.getByUID('book', ctx.params.uid, options)
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.book_title[0] ? doc.data.book_title[0].text : '?title'

    // get the rest
    await getRefs(doc, ctx)
    await getMetadata(doc, ctx, next)
    await fetchSubnavigation(doc, ctx, next)
    await updateNavigation(doc, ctx, next)
    await next()
  }
)
