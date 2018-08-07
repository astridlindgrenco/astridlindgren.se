module.exports = async function navigation(ctx, next) {
  ctx.state.navDocument = await ctx.prismic.getSingle('navigation')
  ctx.assert(ctx.state.navDocument, 500, 'Content missing')
  await next()
}
