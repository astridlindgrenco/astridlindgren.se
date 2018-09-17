'use strict'

const Router = require('koa-router')
const { __ } = require('../locale')
const getRefs = require('./helpers/getRefs')
const getMetadata = require('./helpers/getMetadata')

const router = module.exports = new Router()

router.get(`/:locale/${__('movie')}/:uid`,
  async function (ctx, next) {
    ctx.view = 'movie'
    ctx.state.params = []
    const options = { lang: ctx.state.lang }
    const doc = await ctx.prismic.getByUID('movie', ctx.params.uid, options)
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.movie_title[0] ? doc.data.movie_title[0].text : '?title'

    // get the rest
    await getRefs(doc.data, ctx)
    await getMetadata(doc, ctx, next)
    await next()
  }
)
