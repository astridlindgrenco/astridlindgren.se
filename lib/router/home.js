var Router = require('koa-router')
var render = require('../render')

var router = module.exports = new Router()

router.get('/',
  async function (ctx, next) {
    // [at(my.startsida2.uid, "welcome")]
    var doc = await ctx.prismic.getSingle('startsida2')
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title[0].text
    await next()
  },
  render(require('../views/home'))
)
