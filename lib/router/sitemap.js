'use strict'

const Router = require('koa-router')

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
    /**
     * TODO Replace poc with traversal of site
     */
    const sitemap = new Map()
    // URL '/' is not used
    sitemap.set('/en', `//${ctx.req.headers.host}/en`)
    sitemap.set('/de', `//${ctx.req.headers.host}/de`)
    sitemap.set('/sv', `//${ctx.req.headers.host}/sv`)
    ctx.state.sitemap = sitemap
    await next()
  }
)

/**
 * Clear map and generate a new map of pages
 * TODO Create support for lang/locale
 */
router.post(process.env.PRISMIC_HOOK_URL,
  async function (ctx, next) {
    console.log(ctx.request.body)
    if (ctx.request.body && ctx.request.body.secret === process.env.PRISMIC_HOOK_SECRET) {
      ctx.db.flushAll()
      ctx.status = 200
    } else {
      ctx.status = 401
    }
  }
)

/*

Prismic example of a recursive sitemap gen

const apiEndpoint = 'https://your-repo-name.prismic.io/api/v2';

// recursively fetch all pages
function getPage(api, page, documents) {
  return api.query(
    Prismic.Predicates.any('document.type', ['page', 'post']),
    { page, pageSize: 100, fetch: [] }
  ).then((response) => {
    if (response.next_page !== null) {
      return getPage(api, page + 1, documents.concat(response.results));
    }
    return documents.concat(response.results);
  });
}

app.route('/sitemap.txt').get((req, res) => {
  Prismic.getApi(apiEndpoint, { req }).then((api) => {
    return getPage(api, 1, []);
  }).then((documents) => {
    let body = '';
    documents.forEach((doc) => {
      body += (${req.protocol}://${req.headers.host}${PrismicConfig.linkResolver(doc)}\r\n);
    });
    res.send(body);
  }).catch((err) => {
    res.status(500).send(Error: ${err.message});
  });
});

*/
