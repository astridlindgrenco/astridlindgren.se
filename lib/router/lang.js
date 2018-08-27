'use static'

/**
 * Handle user language selection.
 */

const Router = require('koa-router')
const { setLocale } = require('../locale')

const router = module.exports = new Router()

router.get('/sv', async function (ctx) {
  setLang('sv', ctx)
})

router.get('/en', async function (ctx) {
  setLang('en', ctx)
})

router.get('/de', async function (ctx) {
  setLang('de', ctx)
})

function setLang (lang, ctx) {
  console.log('setLang', lang, ctx)
  ctx.cookies.set('lang', lang)
  setLocale(lang)
  if (lang === ctx.state.lang) ctx.redirect('/')
}
