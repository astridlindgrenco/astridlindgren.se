'use strict'

module.exports = async function errors (ctx, next) {
  try {
    await next()
  } catch (err) {
    console.error(err)
    ctx.status = err.status || 500
    ctx.state.error = {
      status: ctx.status,
      message: null,
      stack: null
    }

    if (process.env.NODE_ENV === 'development') {
      ctx.state.error.message = err.message
      if (ctx.status === 500) {
        ctx.state.error.stack = err.stack
      }
    }

    if (ctx.accepts('html')) {
      const route = ctx.status === 404 ? '/404' : '/error'
      ctx.redirect(route)
    } else {
      ctx.type = 'application/json'
      ctx.body = ctx.state.error
    }
  }
}
