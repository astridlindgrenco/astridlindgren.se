var Router = require('koa-router')
var render = require('../render')

var router = module.exports = new Router()

router.get('/:path/:sub_path?',
  async function (ctx, next) {
    const uid = ctx.params.sub_path || ctx.params.path
    ctx.state.pages.items.push({
      uid: uid,
      data: {
        text: `Text for ${uid}`
      }
    })
    next()
  },
  render(require('../views/page'))
)
