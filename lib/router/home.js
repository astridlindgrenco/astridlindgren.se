'use strict'

const Router = require('koa-router')
const getRefs = require('./helpers/getRefs')
const getMetadata = require('./helpers/getMetadata')
const { getLang, setLocale } = require('../locale')

const router = module.exports = new Router()

router.get('/', async function (ctx) {
  ctx.redirected = true
  ctx.redirect(`/${ctx.state.lang}`)
})

router.get('/:langCode',
  async function (ctx, next) {
    if (ctx.view) return next()
    ctx.view = 'home'
    const lang = getLang(ctx.params.langCode)
    ctx.assert(lang, 500, 'Content missing')

    const options = { lang: lang }
    const doc = await ctx.prismic.getSingle('home', options)
    ctx.assert(doc, 500, 'Content missing')

    setLang(lang, ctx)
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title[0].text
    ctx.state.params = []

    await getRefs(doc.data, ctx)
    await getMetadata(doc, ctx, next)
    await next()
  }
)

function setLang (lang, ctx) {
  ctx.cookies.set('lang', lang)
  setLocale(lang)
}
