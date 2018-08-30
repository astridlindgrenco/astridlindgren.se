'use strict'

const Router = require('koa-router')
const getRefs = require('./helpers/getRefs')
const { getLang, setLocale } = require('../locale')

const router = module.exports = new Router()

router.get('/', async function (ctx) {
  console.log('/', ctx.state.lang)
  ctx.redirect(`/${ctx.state.lang.substr(0, 2)}`)
})

router.get('/:langCode',
  async function (ctx, next) {
    if (ctx.view) return next()
    ctx.view = 'home'
    const lang = getLang(ctx.params.langCode)
    ctx.assert(lang, 500, 'Content missing')

    console.log('home', lang, ctx.params.langCode)
    const options = { lang: lang }
    const doc = await ctx.prismic.getSingle('home', options)
    ctx.assert(doc, 500, 'Content missing')

    setLang(lang, ctx)
    await getRefs(doc.data, ctx)
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title[0].text

    await next()
  }
)

function setLang (lang, ctx) {
  ctx.cookies.set('lang', lang)
  setLocale(lang)
}
