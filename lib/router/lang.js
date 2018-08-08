'use static'

/**
 * Handle user language selection.
 */

const Router = require('koa-router')
const router = module.exports = new Router()

router.get('/sv', async function (ctx, next) {
  setLang('sv', ctx, next)
})

router.get('/en', async function (ctx, next) {
  setLang('en', ctx, next)
})

router.get('/de', async function (ctx, next) {
  setLang('de', ctx, next)
})

router.get('/ru', async function (ctx, next) {
  setLang('ru', ctx, next)
})

function setLang (lang, ctx, next) {
  ctx.cookies.set('lang', lang)
  if (lang === ctx.state.lang) ctx.redirect('/')
}
