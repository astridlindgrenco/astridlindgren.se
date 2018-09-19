'use strict'

const Router = require('koa-router')
const Prismic = require('prismic-javascript')
var { __, setLocale } = require('../locale')
const router = module.exports = new Router()
var fs = require('fs')

// remove - only for test
router.get('/rebuild',
  async function (ctx, next) {
    rebuild(ctx)
  }
)

/**
 * Clear and generate new a sitemap.txt and a new link resolver map.
 */
router.post(process.env.PRISMIC_HOOK_URL || '/prismic_update',
  async function (ctx, next) {
    console.log('[HOOK]: Testing secret...')
    if (ctx.request.body && ctx.request.body.secret === process.env.PRISMIC_HOOK_SECRET) {
      console.log('[HOOK]: Rebuilding sitemap and linkmap...')
      await rebuild()
      ctx.status = 200
    } else {
      console.log('[HOOK]: Incorrect secret.')
      ctx.status = 401
    }
  }
)

async function rebuild (ctx) {
  const linkmap = new Map()
  // store sitemap (autocloses)
  const sitemapWriter = fs.createWriteStream('lib/assets/sitemap.txt')
  sitemapWriter.on('finish', () => {
    console.log('[HOOK]: sitemap.txt created')
  })
  // traverse Prismic documents
  const docs = await getDocs(ctx, 1, [])
  await (async () => {
    await asyncForEach(docs, async (doc) => {
      const path = await getPath(ctx, doc)
      if (path && doc.uid) {
        sitemapWriter.write(`${ctx.state.url}${path}\n`)
        linkmap.set(`${doc.lang}-${doc.uid}`, `${path}`)
      }
    })
  })()
  sitemapWriter.end()
  // store linkmap
  fs.writeFile('links.map', JSON.stringify([...linkmap]), function (err) {
    ctx.assert(err === null, 500, `Internal Server Error: ${err}`)
    console.log('[HOOK]: links.map created', 'size:', linkmap.size)
  })
}

async function getDocs (ctx, page, docs) {
  const options = {
    lang: '*',
    page,
    pageSize: 999,
    fetch: ['page.parent_page']
  }
  return ctx.prismic.query([
    // TODO what types?
    Prismic.Predicates.any('document.type', ['home', 'page', 'listpage', 'book', 'citatsida', 'newsdesk'])
  ], options).then((response) => {
    if (response.next_page !== null) {
      return getDocs(ctx, page + 1, docs.concat(response.results))
    }
    return docs.concat(response.results)
  })
}

async function getPath (ctx, doc) {
  const locale = doc.lang.substring(0, 2)
  setLocale(locale)
  doc.default_uid = doc.uid
  let path = await getPathRecursive(ctx, doc)
  if (path > '') {
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

async function getPathRecursive (ctx, doc) {
  if (doc.data.parent_page && doc.data.parent_page.uid) {
    const options = {
      lang: doc.lang,
      fetch: ['page.parent_page']
    }
    const parentDoc = await ctx.prismic.getByUID('page', doc.data.parent_page.uid, options)
    if (parentDoc) {
      const path = await getPathRecursive(ctx, parentDoc)
      if (path) return `${path}/${doc.uid}`
    }
    return `/${doc.data.parent_page.uid}/${doc.uid}`
  }
  return `/${doc.uid}`
}

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
