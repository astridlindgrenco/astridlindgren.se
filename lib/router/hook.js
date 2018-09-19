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
  // TODO add recursive check up to top parent
  // console.log(doc.data.parent_page)
  if (doc.data.parent_page && doc.data.parent_page.uid) {
    return `/${doc.data.parent_page.uid}/${doc.uid}`
  }
  return `/${doc.uid}`
}

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

/*

let ref
function getPathRecursive (db, doc, result, n) {
  const key = doc.lang + '-' + doc.uid
  const link = sitemap.get(key) // db ? db.get(key) : false
  if (link) {
    console.log('links.map hit!')
    return link
  } else {
    console.log('- - - -', key)
  }

  if (!result) result = ''
  if (!n) n = 1

  // This is ugly and slow, would be a lot better if we could get async working here
  if (!ref) {
    n++
    ref = JSON.parse((request('GET', process.env.PRISMIC_API, {
      qs: {
        lang: doc.lang,
        fetch: 'page.parent_page'
      }
    }).body)).refs[0].ref
  }

  let res = request('GET', HTTP_URL, {
    qs: {
      ref: ref,
      q: '[[at(my.' + doc.type + '.uid,"' + doc.uid + '")]][[fetch(parent_page)]]',
      lang: doc.lang,
      fetch: 'page.parent_page'
    }
  })

  if (res.statusCode !== 200 || !res.body) {
    n++
    if (n >= MAX_HTTP_FAILS) return '/' + doc.default_uid

    console.log('[Resolve] Http failed:', res)
    getPathRecursive(db, doc, result, n)
  }

  const item = JSON.parse(res.body.toString()).results[0]
  result = '/' + item.uid + result

  // If top level
  if (!item.data.parent_page || !item.data.parent_page.uid) {
    console.log(`[Resolve] (${n})`, 'DB:', !!db, 'UID:', doc.default_uid, 'Path:', result)
    ref = null
    if (db) {
      db.set(key, result)
    }
    return result
  }

  doc.uid = item.data.parent_page.uid

  return getPathRecursive(db, doc, result, ++n)
}

*/
