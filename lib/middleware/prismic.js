const Prismic = require('prismic-javascript')
const Https = require('https')

module.exports = async function prismicApi (ctx, next) {
  if (!process.env || !process.env.PRISMIC_API) return next()

  // Expose the Prismic api on the context object.
  const api = ctx.prismic = await Prismic.api(
    process.env.PRISMIC_API,
    {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
      req: ctx.req,
      apiCache: ctx.cache,
      apiDataTTL: 5 /* default is 5 s */,
      proxyAgent: Https.Agent({
        keepAlive: true /* default is false */,
        keepAliveMsecs: 10000 /* default is 1000 ms */,
        maxSockets: 100 /* default is infinity */,
        timeout: 10000 /* default is 1000 ms */
      })
    }
  )

  // Extend state with additional info related to the Prismic api.
  const masterRef = api.refs.find(ref => ref.isMasterRef)
  const previewRef = ctx.cookies.get(Prismic.previewCookie)
  ctx.state.ref = previewRef || masterRef.ref

  return next()
}
