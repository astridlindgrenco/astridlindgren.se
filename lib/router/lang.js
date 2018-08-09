'use static'

/**
 * Handle user language selection.
 */

const Router = require('koa-router')
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

router.get('/ru', async function (ctx) {
  setLang('ru', ctx)
})

function setLang (lang, ctx) {
  ctx.cookies.set('lang', lang)
  if (lang === ctx.state.lang) ctx.redirect('/')
}
