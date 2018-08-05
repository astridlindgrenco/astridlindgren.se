var Router = require('koa-router')
var render = require('../render')

var router = module.exports = new Router()

router.get('/:path/:sub_path?',
  async function (ctx, next) {
    const uid = ctx.params.sub_path || ctx.params.path
    const doc = await ctx.prismic.getByUID('page', uid)
    ctx.assert(doc, 404, 'Content missing')
    ctx.state.title = 'Här ska en titel in...'
    ctx.state.pages.items.push(doc)   
    next()
  },
  render(require('../views/page'))
)
