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
router.post(process.env.PRISMIC_Hook_URL || '/prismic_update',
  async function (ctx, next) {
    console.log('[Hook]: Testing secret...')
    if (ctx.request.body && ctx.request.body.secret === process.env.PRISMIC_Hook_SECRET) {
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
  const sitemapWriter = fs.createWriteStream('lib/assets/sitemap.txt')
  sitemapWriter.on('finish', () => {
    console.log('[Hook]: sitemap.txt created')
  })
  // traverse Prismic documents
  const docs = await getDocs(ctx, 1, [])
  const relationships = buildRelationshipMap(docs)
  docs.forEach(function addPath (doc) {
    const path = getPath(doc, relationships)
    if (path) {
      sitemapWriter.write(`${ctx.state.url}${path}\n`)
      linkmap.set(`${doc.id}`, path)
    }
  })
  sitemapWriter.end()
  // store linkmap
  fs.writeFile('links.map', JSON.stringify([...linkmap]), function (err) {
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
  const options = {
    lang: '*',
    page,
    pageSize: 100,
    fetch: [...parentPageFieldIDs]
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
      if (doc.uid === __('booklist')) return `/${locale}/${__('booklist')}`
      if (doc.uid === __('movielist')) return `/${locale}/${__('movielist')}`
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
    fullPath.push(relationships.get(parentID).uid)
    return getPathRecursive(parentID, relationships, fullPath)
  } else {
    return '/' + fullPath.reverse().join('/')
  }
}
