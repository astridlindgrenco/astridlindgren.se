const document = require('./layouts/document')

module.exports = render

function render (view) {
  return async (ctx, next) => {

    /**
     * Extend state from context
     */
    ctx.state.params = ctx.params

    try {
      if (ctx.accepts('html')) {
        ctx.type = 'text/html'
        ctx.body = asHtml(view, ctx.state)
      } else if (ctx.accepts('json')) {
        ctx.type = 'application/json'
        ctx.body = ctx.state
      } else {
        ctx.throw(406)
      }
    } catch (err) {
      ctx.status = err.status || 500
      ctx.state.error = {
        status: ctx.status,
        message: null
      }

      if (err.expose || process.env.NODE_ENV === 'development') {
        ctx.state.error.message = err.message
      }

      if (ctx.status === 500 && process.env.NODE_ENV === 'development') {
        ctx.state.error.stack = err.stack
      }

      if (ctx.accepts('html')) {
        const route = ctx.status === 404 ? '/404' : '/error'
        ctx.type = 'text/html'
        ctx.body = asHtml(view, ctx.state)
      } else {
        ctx.type = 'application/json'
        ctx.body = ctx.state.error
      }
    }

  }

  function asHtml (view, state) {
    switch (state.layout) {
      case 'modal':
        return document(view, state);
      default: 
        return document(view, state);
    }
  }
  
}
