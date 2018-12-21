const Prismic = require('prismic-javascript')
const { getApi } = require('../components/base/utils')

module.exports = async function prismicApi (ctx, next) {
  // Expose the Prismic api on the context object.
  const api = ctx.prismic = await getApi(ctx.req)

  // Extend state with additional info related to the Prismic api.
  const masterRef = api.refs.find(ref => ref.isMasterRef)
  const previewRef = ctx.cookies.get(Prismic.previewCookie)
  ctx.state.ref = previewRef || masterRef.ref

  return next()
}
