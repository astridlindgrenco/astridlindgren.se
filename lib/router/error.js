'use strict'
const Router = require('koa-router')
const render = require('../render')

const router = module.exports = new Router()

router.get('/error',
  async function (ctx, next) {
    ctx.state.title = 'Error'
    await next()
  },
  render(require('../views/GenericError'))
)
