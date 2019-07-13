'use strict'

const Router = require('koa-router')
const { asText } = require('prismic-richtext')
const getRefs = require('./helpers/getRefs')
const getMetadata = require('./helpers/getMetadata')
const updateNavigation = require('./helpers/updateNavigation')

const router = module.exports = new Router()

router.get('/:locale/*',
  async function (ctx, next) {
    if (ctx.view) return next()

    // Split url into array of params
    // FIXME: Handle query and anchor
    const params = ctx.params['0'].split('/')

    // uid is always last item in params
    const uid = params[params.length - 1]

    const options = { lang: ctx.state.lang }
    const doc = await ctx.prismic.getByUID('page', uid, options)
    if (!doc) return next()
    ctx.view = 'page'
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title ? asText(doc.data.title) : 'Rubrik saknas'
    ctx.state.uid = doc.uid
    ctx.state.url = `/${ctx.state.locale}/${params.join('/')}`
    ctx.state.params = params
    ctx.state.is_character_menu = doc.data.is_character_menu === 'Ja'
    ctx.state.font = doc.data.font_id

    console.log('[Router->Page] params: ' + JSON.stringify(params))

    if (ctx.state.is_character_menu) {
      ctx.state.character_menu = {
        title: doc.data.character_menu_title,
        accent: doc.data.character_menu_color
      }
    }

    console.log('[Router->Page] före Promise.all')

    try {
      await Promise.all([
        getRefs(doc.data, ctx),
        getMetadata(doc, ctx, next),
        updateNavigation(doc, ctx, next)
      ])
    } catch(e) {
      console.log('[Router->Page] error', e)
    }
    console.log('[Router->Page] efter Promise.all')

    return next()
  }
)
