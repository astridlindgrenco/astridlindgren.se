'use strict'

const Router = require('koa-router')
const Prismic = require('prismic-javascript')

const router = module.exports = new Router()

/**
 * Generate a new map of pages
 * TODO Create support for lang/locale
 * TODO Create support for canonical urls
 */
router.get('/sitemap.txt',
  async function (ctx, next) {
    if (ctx.view) return next()
    ctx.view = 'sitemap'
    ctx.state.title = 'Sitemap'
    ctx.state.params = []
    ctx.db.flushAll()
    const sitemap = new Map()
    // URL '/' is not used
    sitemap.set('/en', `//${ctx.req.headers.host}/en`)
    sitemap.set('/de', `//${ctx.req.headers.host}/de`)
    sitemap.set('/sv', `//${ctx.req.headers.host}/sv`)
    /**
     * TODO traversal of site
     */
    const docs = await getPage(ctx, 1, [])
    // console.log(docs)
    docs.forEach((doc) => {
      const locale = doc.lang.substring(0, 2)
      // TODO add function to get full path to doc, here or in getPage
      sitemap.set(`/${locale}/${doc.uid}`, `//${ctx.req.headers.host}//${locale}/path/to/${doc.uid}`)
    })
    ctx.state.sitemap = sitemap
    await next()
  }
)

/**
 * Clear map and generate a new map of pages
 * TODO Create support for lang/locale
 */
router.post(process.env.PRISMIC_HOOK_URL || '/prismic_update',
  async function (ctx, next) {
    console.log('[HOOK]: Testing secret...')
    if (ctx.request.body && ctx.request.body.secret === process.env.PRISMIC_HOOK_SECRET) {
      console.log('[HOOK]: Flushing cache...')
      ctx.status = 200
    } else {
      console.log('[HOOK]: Incorrect secret.')
      ctx.status = 401
    }
  }
)

async function getPage (ctx, page, docs) {
  // TODO add language to function param
  const options = { lang: 'sv-se', page, pageSize: 100, fetch: [] }
  console.log(options)
  return ctx.prismic.query([
    // TODO what types?
    Prismic.Predicates.any('document.type', ['home', 'page', 'book', 'citatsida'])
  ], options).then((response) => {
    if (response.next_page !== null) {
      return getPage(ctx, page + 1, docs.concat(response.results))
    }
    return docs.concat(response.results)
  })
}
