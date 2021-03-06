'use strict'

const Router = require('koa-router')
const { __ } = require('../locale')

const router = module.exports = new Router()

router.get(`/:locale/:movie/:uid`,
  async function (ctx, next) {
    if (ctx.view) return next()
    if (ctx.params.movie !== __('movie')) return next()
    const options = { lang: ctx.state.lang }
    const doc = await ctx.prismic.getByUID('movie', ctx.params.uid, options)
    if (!doc) return next()
    ctx.view = 'movie'
    ctx.state.params = [__('movielist')]
    ctx.state.doc = doc
    ctx.state.title = doc.data.movie_title[0] ? doc.data.movie_title[0].text : '?title'

    return next()
  }
)
