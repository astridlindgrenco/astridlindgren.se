'use strict'

const Router = require('koa-router')
const { asText } = require('prismic-richtext')

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
    ctx.state.doc = doc
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

    return next()
  }
)
