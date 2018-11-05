const Prismic = require('prismic-javascript')

module.exports = async function prismicApi (ctx, next) {
  if (!process.env || !process.env.PRISMIC_API) return next()

  // Expose the Prismic api on the context object.
  const api = ctx.prismic = await Prismic.api(
    process.env.PRISMIC_API,
    {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
      req: ctx.req,
      apiCache: ctx.cache,
      apiDataTTL: 60 * 60 * 24 * 7
    }
  )

  // Extend state with additional info related to the Prismic api.
  const masterRef = api.refs.find(ref => ref.isMasterRef)
  const previewRef = ctx.cookies.get(Prismic.previewCookie)
  ctx.state.ref = previewRef || masterRef.ref

  return next()
}
