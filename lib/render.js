const document = require('./layouts/document')

module.exports = render

function render (view) {
  return async (ctx, next) => {
    // extend state from context
    ctx.state.params = ctx.params

    if (ctx.accepts('html')) {
      ctx.type = 'text/html'
      ctx.body = document(view, ctx.state)
    } else {
      ctx.throw(406)
    }
  }
}
