var Router = require('koa-router')
var render = require('../render')

var router = module.exports = new Router()

router.get('/',
  async function (ctx, next) {
    console.log('home')
    var doc = await ctx.prismic.getSingle('startsida2')
    console.log(doc)
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = 'Här ska en titel in...'
    next()
  },
  render(require('../views/home'))
)
