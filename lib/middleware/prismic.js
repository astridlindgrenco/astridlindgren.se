const Prismic = require('prismic-javascript')

module.exports = async function prismicApi (ctx, next) {
  // expose the Prismic api on the context object
  const api = ctx.prismic = await Prismic.api(
    process.env.PRISMIC_API,
    {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
      req: ctx.req,
      //apiCache: ctx.cache,
      apiDataTTL: 60 * 60 * 24 * 7
    }
  )

  /**
   * Extend state with additional info related to the Prismic api
   */

  /*let ref = ctx.cache.get('ref')
  if (!ref) {
    ref = api.refs.find(ref => ref.isMasterRef)
    ctx.cache.set('ref', ref)
  }*/
  let ref = api.refs.find(ref => ref.isMasterRef)

  const previewCookie = ctx.cookies.get(Prismic.previewCookie)
  ctx.state.isEditor = !!previewCookie
  ctx.state.ref = previewCookie || process.env.PRISMIC_REF || ref.ref

  return next()
}
