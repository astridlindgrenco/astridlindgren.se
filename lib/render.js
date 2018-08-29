const document = require('./layouts/document')
const Page404 = require('./router/404')

/**
 * Application Renderer, uses ctx.view to determine which view to draw.
 * @param {ctx} object koa context
 * @param {next} function async component
 */
module.exports = async (ctx, next) => {
  try {
    await next()

    ctx.body = await document(require('./views/' + ctx.view), ctx.state, ctx)
    if (ctx.status !== 200) throw new Error('Cannot find view')
  } catch (ex) {
    console.log('[Error]: ' + JSON.stringify(ex))
    ctx.state.error = ctx.error

    try {
      if (!ctx.error) {
        ctx.error = {
          status: 500
        }

        if (ex) ctx.stack = ex
      }

      // Code exec error
      if (ex.code) {
        if (!ctx.error) ctx.error = {}
        ctx.error.status = 500
        ctx.error.message = ex.message
        ctx.error.stack = ex.stack

        // Kinda 404 but not really
        if (ex.code === 'MODULE_NOT_FOUND') {
          ctx.error.status = 404
          ctx.error.message = `Page type with ID ${ctx.view} not found`
        }

        throw new Error(ex.code)
      }

      // 404
      if (ctx.error.status === 404) {
        await Page404(ctx, next)
        ctx.body = await document(require('./views/404'), ctx.state)
      }

      // Other
      if (!ctx.body) throw new Error(ex)
    } catch (ex) {
      console.log('[Error]: ' + JSON.stringify(ex))

      // Generic error handler
      ctx.state.error = ctx.error
      ctx.body = await document(require('./views/generic_error'), ctx.state)
    }
  }
}
