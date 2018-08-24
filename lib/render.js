const document = require('./layouts/document')
const Page404 = require('./router/404')

module.exports = async (ctx, next) => {
  try {
    await next()

    switch (ctx.view) {
      case 'home':
        ctx.body = await document(require('./views/home'), ctx.state)
        break
      case 'page':
        ctx.body = await document(require('./views/page'), ctx.state)
        break
      case 'booklist':
        ctx.body = await document(require('./views/booklist'), ctx.state)
        break
      case 'newsdesk':
        ctx.body = await document(require('./views/newsroom'), ctx.state)
        break
      default:
        ctx.error.status = 404
        ctx.error.message = `Page type with ID ${ctx.view} not found`
        throw new Error()
    }
  } catch (ex) {
    ctx.state.error = ctx.error

    try {
      // Code exec error
      if (ex.code) {
        if (!ctx.error) ctx.error = {}
        ctx.error.status = 500
        ctx.error.message = ex.message
        ctx.error.stack = ex.stack
        throw new Error()
      }

      // 404
      if (ctx.status === 404 || ctx.error.status === 404) {
        await Page404(ctx, next)
        ctx.body = await document(require('./views/404'), ctx.state)
      }

      // Other
      if (!ctx.body) throw new Error()
    } catch (ex) {
      // Generic error handler
      ctx.state.error = ctx.error
      ctx.body = await document(require('./views/generic_error'), ctx.state)
    }
  }
}
