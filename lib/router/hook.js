'use strict'

const Router = require('koa-router')
const Prismic = require('prismic-javascript')
var { __, setLocale } = require('../locale')
const router = module.exports = new Router()
var fs = require('fs')

const LINKMAP_FILENAME = 'links.map'

// in case link cache file is missing
try {
  fs.accessSync(LINKMAP_FILENAME, fs.F_OK)
} catch (err) {
  fs.writeFileSync(LINKMAP_FILENAME, JSON.stringify([...new Map()]))
}
// in case link cache file is empty
router.get('*',
  async function (ctx, next) {
    const stats = fs.statSync(LINKMAP_FILENAME)
    if (stats.size < 100) await rebuild(ctx)
    const ts = Date.now()
    await next()
    console.log(`${Date.now() - ts} ms`, 'GET', ctx.req.headers.referer)
  }
)

/**
 * Clear and generate new a sitemap.txt and a new link resolver map.
 */
router.post(process.env.PRISMIC_HOOK_URL || '/prismic_update',
  async function (ctx, next) {
    console.log('[Hook]: Testing secret...')
    if (ctx.request.body && ctx.request.body.secret === process.env.PRISMIC_HOOK_SECRET) {
      console.log('[Hook]: Rebuilding sitemap and linkmap...')
      await rebuild(ctx)
      ctx.status = 200
    } else {
      console.log('[Hook]: Incorrect secret.')
      ctx.status = 401
    }
  }
)

async function rebuild (ctx) {
  const linkmap = new Map()
  // store sitemap (autocloses)
  const sitemapWriter = fs.createWriteStream('lib/assets/sitemap.xml')
  sitemapWriter.write(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`)
  sitemapWriter.on('finish', () => {
    console.log('[Hook]: sitemap.xml created')
  })
  // traverse Prismic documents
  const docs = await getDocs(ctx, 1, [])
  const relationships = buildRelationshipMap(docs)
  docs.forEach(function addPath (doc) {
    const path = getPath(doc, relationships)
    if (path) {
      sitemapWriter.write(`\t<url>\n\t\t<loc>${ctx.state.url}${path}</loc>\n\t\t<lastmod>${doc.last_publication_date}</lastmod>\n\t</url>\n`)
      let title = doc.data.title || doc.data.book_title || doc.data.movie_title
      if (Array.isArray(title)) title = title[0].text
      linkmap.set(`${doc.id}`, { path: path, title: title, parentId: doc.data.parent_page && doc.data.parent_page.id })
    }
  })
  sitemapWriter.write(`</urlset>\n`)
  sitemapWriter.end()
  // store linkmap
  fs.writeFile(LINKMAP_FILENAME, JSON.stringify([...linkmap]), function (err) {
    ctx.assert(err === null, 500, `Internal Server Error: ${err}`)
    console.log('[Hook]: links.map created', 'size:', linkmap.size)
  })
}

/**
 * Creates a map of document ids and it's uid and parent relationship
 * @param  {Array} docs Prismic documents
 * @return {Map}        Map of UID and optional parent indexed by document ID
 */
function buildRelationshipMap (docs) {
  var relationships = docs.map(function buildRelObject (doc) {
    // Build key/value pairs in map
    return [
      doc.id,
      {
        uid: doc.uid,
        parentID: doc.data && doc.data.parent_page ? doc.data.parent_page.id : undefined
      }
    ]
  })
  return new Map(relationships)
}

async function getDocs (ctx, page, docs) {
  const docTypes = ['home', 'page', 'listpage', 'book', 'movie', 'newsdesk', 'citatsida']
  const parentPageFieldIDs = docTypes.map(type => `${type}.parent_page`)
  const titleFields = ['home.title', 'page.title', 'listpage.title', 'book.book_title', 'movie.movie_title', 'newsdesk.title', 'citatsida.title']
  const options = {
    lang: '*',
    page,
    pageSize: 100,
    fetch: [...parentPageFieldIDs.concat(titleFields)]
  }
  return ctx.prismic.query([
    Prismic.Predicates.any('document.type', docTypes)
  ], options).then((response) => {
    if (response.next_page !== null) {
      return getDocs(ctx, page + 1, docs.concat(response.results))
    }
    return docs.concat(response.results)
  })
}

function getPath (doc, relationships) {
  const locale = doc.lang.substring(0, 2)
  setLocale(locale)
  switch (doc.type.toLowerCase()) {
    case 'home':
      return `/${locale}`
    case 'page':
      const path = getPathRecursive(doc.id, relationships)
      return `/${locale}${path}`
    case 'book':
      return `/${locale}/${__('book')}/${doc.uid}`
    case 'movie':
      return `/${locale}/${__('movie')}/${doc.uid}`
    case 'listpage':
      if (doc.uid === __('booklist')) return `/${locale}/${__('the works')}/${__('booklist')}`
      if (doc.uid === __('movielist')) return `/${locale}/${__('the works')}/${__('movielist')}`
      break
    case 'newsdesk':
      return `/${locale}/${__('newsdesk')}`
    case 'citatsida':
      return `/${locale}/${__('quotes')}`
    default:
      return `/${locale}/${doc.uid}#broken-${doc.type}`
  }
}

function getPathRecursive (id, relationships, fullPath = []) {
  var {
    uid,
    parentID
  } = relationships.get(id)
  // If it hasn't yet been added, add it
  if (uid && fullPath.indexOf(uid) === -1) fullPath.push(uid)
  // If it has a parent and it's not itself (human error),
  // add it and to recursive call to find potential grand parents
  if (parentID && id !== parentID) {
    let parent = relationships.get(parentID)
    if (!parent || !parent.uid) return

    fullPath.push(parent.uid)
    return getPathRecursive(parentID, relationships, fullPath)
  } else {
    return '/' + fullPath.reverse().join('/')
  }
}
