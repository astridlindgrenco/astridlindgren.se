const document = require('./layouts/document')
const errorView = require('./views/generic_error')
/**
 * Application Renderer, uses ctx.view to determine which view to draw.
 * @param {ctx} object koa context
 * @param {next} function async component
 */
module.exports = async (ctx, next) => {
  // wait for Router
  await next()

  if (ctx.redirected || !ctx.view) return

  try {
    const view = require('./views/' + ctx.view)
    ctx.body = await document(view, ctx.state, ctx)
    ctx.status = ctx.view === '404' ? 404 : 200
    console.log(ctx.status, ctx.view)
  } catch (err) {
    console.log('[Render]:', 'Error', err)
    ctx.body = await document(errorView, ctx.state)
    ctx.error = { status: ctx.status, message: ctx.message }
    ctx.status = 500
  }

  console.log(`[Render]: ${Date.now() - ctx.state.ts} ms`, ctx.view)
}
