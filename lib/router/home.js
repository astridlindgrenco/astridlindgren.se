var Router = require('koa-router')
var render = require('../render')

var router = module.exports = new Router()

router.get('/',
  async function (ctx, next) {
    var doc = await ctx.prismic.getSingle('startsida2')
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    next()
  },
  render(require('../views/home'))
)
