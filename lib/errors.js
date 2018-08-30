'use strict'

module.exports = async function errors (ctx, next) {
  try {
    await next()
  } catch (err) {
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
      ctx.error = {
        status: ctx.status,
        message: err.message || ctx.message,
        stack: err.stack || ctx.stack
      }
      console.log('[Error]: ', ctx.error)
    } else {
      ctx.type = 'application/json'
      ctx.body = ctx.state.error
    }
  }
}
