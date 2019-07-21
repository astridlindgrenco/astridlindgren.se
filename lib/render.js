const document = require('./layouts/document')
const errorView = require('./views/generic_error')
/**
 * Application Renderer, uses ctx.view to determine which view to draw.
 * @param {ctx} object koa context
 * @param {next} function async component
 */
module.exports = async (ctx, next) => {
  if (ctx.redirected || !ctx.view) return
  try {
    const view = require('./views/' + ctx.view)
    ctx.body = await document(view, ctx)
    ctx.status = ctx.view === '404' ? 404 : 200
  } catch (err) {
    console.log('[Render]:', 'Error', err)
    if (process.env.NODE_ENV === 'development') ctx.state.error = err
    ctx.body = await document(errorView, ctx)
    ctx.status = err.statusCode || err.status || 500
  }

  console.log(`[Render]: ${Date.now() - ctx.state.ts} ms`, ctx.view, ctx.status)
}
