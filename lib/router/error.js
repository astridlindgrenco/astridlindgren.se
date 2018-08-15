'use strict'

const Router = require('koa-router')
const router = module.exports = new Router()

router.get('/error',
  async function (ctx, next) {
    return null
  }
)
