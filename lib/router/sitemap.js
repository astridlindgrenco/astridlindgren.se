'use strict'

const Router = require('koa-router')
const Prismic = require('prismic-javascript')
var { __, setLocale } = require('../locale')
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
    /**
     * TODO traversal of site
     */
    const docs = await getPage(ctx, 1, [])
    const f = async () => {
      await asyncForEach(docs, async (doc) => {
        const path = await getPath(doc)
        if (path) {
          sitemap.set(`/${doc.lang}/${doc.uid}`, `//${ctx.req.headers.host}${path}`)
        }
      })
    }
    await f()
    ctx.state.sitemap = sitemap
    await next()
  }
)

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

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
  const options = { lang: '*', page, pageSize: 999, fetch: [] }
  return ctx.prismic.query([
    // TODO what types?
    Prismic.Predicates.any('document.type', ['home', 'page', 'listpage', 'book', 'citatsida', 'newsdesk'])
  ], options).then((response) => {
    if (response.next_page !== null) {
      return getPage(ctx, page + 1, docs.concat(response.results))
    }
    return docs.concat(response.results)
  })
}

async function getPath (doc) {
  const locale = doc.lang.substring(0, 2)
  setLocale(locale)
  doc.default_uid = doc.uid
  let path = await getPathRecursive(doc)
  if (path > '') {
    if (doc.type === 'listpage') {
      if (doc.uid === __('booklist')) path = '/' + __('booklist') + path
      if (doc.uid === __('movielist')) path = '/' + __('movielist') + path
    }
    return `/${locale}` + path
  } else {
    switch (doc.type.toLowerCase()) {
      case 'home':
        return `/${locale}`
      case 'page':
        return `/${locale}/${doc.uid}`
      case 'book':
        return `/${locale}/${__('book')}/${doc.uid}`
      case 'listpage':
        if (doc.uid === __('booklist')) return `/${locale}/${__('booklist')}`
        if (doc.uid === __('movielist')) return `/${locale}/${__('movielist')}`
        break
      case 'newsdesk':
        return `/${locale}/${__('newsdesk')}`
      case 'citatsida':
        return `/${locale}/${__('quotes')}`
      default:
        return '/'
    }
  }
}

async function getPathRecursive (doc) {
  return ''
}
