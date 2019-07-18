const Prismic = require('prismic-javascript')
const Https = require('https')

/**
 * Adds the Prismic api object to the Koa context object. As a Koa middleware
 * this happens once for each client request of a page. The Koa context object
 * and the api object lives for the duration of time until the page request is
 * resolved. During that time several requests are done to fetch content objects
 * from Prismic that composes the requested page. The expected time to compose a
 * page should be well under 1s, with perhaps 5 fetches around 10 to 100ms.
 *
 * @param {object} ctx - The Koa context object.
 * @param {object} next - Call chaining object.
 */
module.exports = async function prismicApi (ctx, next) {
  if (!process.env || !process.env.PRISMIC_API) return next()

  // Create the Prismic api object. Expected lifetime < 1s.
  const api = ctx.prismic = await Prismic.api(
    process.env.PRISMIC_API,
    {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
      // apiCache: use the default in memory cache
      apiDataTTL: 5 /* default is 5s (5 times normally needed) */,
      // boost socket capacity with a proxy agent
      proxyAgent: Https.Agent({
        keepAlive: true /* default is false */,
        keepAliveMsecs: 5000 /* default is 1000 ms */,
        maxSockets: 100 /* default is infinity */,
        timeout: 1000 /* default is 1000 ms */
      })
    }
  )

  // Find out what repository reference to use. MasterRef changes
  // with each change in the repository (update of content).
  const masterRef = api.refs.find(ref => ref.isMasterRef)
  const previewRef = ctx.cookies.get(Prismic.previewCookie)
  ctx.state.ref = previewRef || masterRef.ref
  console.log('[Prismic]', process.env.PRISMIC_API, `Version ${api.data.version}`, previewRef ? `Preview ${previewRef}` : `Master ${masterRef.ref}`)

  return next()
}
