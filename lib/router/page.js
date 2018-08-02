var Router = require('koa-router')
var render = require('../render')

var router = module.exports = new Router()

router.get('/:path/:sub_path?',
  async function (ctx, next) {
    const uid = ctx.params.sub_path || ctx.params.path
    const doc = await ctx.prismic.getByUID('page', uid)
    
    if (doc) {
      ctx.state.pages.items.push(doc)
    } else {
      // TODO hämta språkspecifik 404-sida istället
      ctx.state.pages.items.push({
        uid: uid,
        data: {
          error: 400,
          text: `hittade ej ${uid}`
        }
      })
    }
    next()
  },
  render(require('../views/page'))
)
