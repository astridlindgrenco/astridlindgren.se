module.exports = async function menu(ctx, next) {
  ctx.state.nav = await ctx.prismic.getSingle('navigation')
  ctx.assert(ctx.state.nav, 500, 'Content missing')
  await next()
}
