var Router = require('koa-router')
var render = require('../render')

var router = module.exports = new Router()

router.get('/:path/:sub_path?',
  async function (ctx, next) {
    const uid = ctx.params.sub_path || ctx.params.path
    const doc = await ctx.prismic.getByUID('page', uid)
    ctx.assert(doc, 404, `404 NOT FOUND ${uid}`)
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title[0].text
    await next()
  },
  render(require('../views/page'))
)
