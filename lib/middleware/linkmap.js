'use strict'

const Prismic = require('prismic-javascript')
const { __, setLocale } = require('../locale')
const { size, reloadLinkmap } = require('../resolve')
const fs = require('fs')
const axios = require('axios')

const LINKMAP_FILENAME = 'links.map'
let firstRun = true

module.exports = async function linkmap (ctx, next) {
  if (size() === 0 || firstRun) {
    await rebuild(ctx)
    firstRun = true
  }
  return next()
}

async function purge (url) {
  if (process.env.VARNISH_IP) {
    axios({
      method: 'purge',
      url: `http://${process.env.VARNISH_IP}/${url}`
    }).then(function (response) {
      console.log(`[Linkmap]: Purge cache for ${url} at ${process.env.VARNISH_IP} returned ${response.status}.`)
    }).catch(function (error) {
      console.log(`[Linkmap]: Purge cache for ${url} at ${process.env.VARNISH_IP} returned ${error}.`)
    })
  }
}

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
  const now = new Date().toISOString()
  docs.forEach(function addPath (doc) {
    const path = getPath(doc, relationships)
    if (path) {
      // check purge
      if (justChanged(doc.last_publication_date)) {
        purge(path)
      }
      // sitemap entry
      sitemapWriter.write(`\t<url>\n\t\t<loc>${ctx.state.url}${path}</loc>\n\t\t<lastmod>${toTzd(doc.last_publication_date || now)}</lastmod>\n\t</url>\n`)
      // linkmap entry
      let title = doc.data.title || doc.data.book_title || doc.data.movie_title
      if (Array.isArray(title)) {
        title.length > 0
          ? title = title[0].text
          : title = 'untitled'
      }
      linkmap.set(`${doc.id}`, {
        path: path,
        title: title,
        menuLabel: doc.data.menu_label,
        numero: doc.data.numero,
        parentId: doc.data.parent_page && doc.data.parent_page.id })
    }
  })
  sitemapWriter.write(`</urlset>\n`)
  sitemapWriter.end()
  // avoid overwrite a possibly working linkmap on disk with a empty one
  if (linkmap.size > 0) {
    fs.writeFileSync(LINKMAP_FILENAME, JSON.stringify([...linkmap]))
    console.log('[Linkmap]: links.map created', 'size:', linkmap.size)
  }
  reloadLinkmap()
}

/**
 *
 * @param {String with dateTime like 2018-11-05T09:04:01+0000} s
 * @returns {String with TZD +00:00}
 */
function toTzd (s) {
  return s.replace('0000', '00:00')
}

function justChanged (s) {
  if (s === null) return false
  try {
    const ms = Date.now() - new Date(s.substring(0, 19))
    return ms < 60000
  } catch (e) {
    return false
  }
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
  // const parentPageFieldIDs = docTypes.map(type => `${type}.parent_page`)
  // const titleFields = ['home.title', 'page.title', 'listpage.title', 'book.book_title', 'movie.movie_title', 'newsdesk.title', 'citatsida.title']
  const fields = ['parent_page', 'title', 'numero', 'menu_label']
  const documentFields = docTypes.map(function getFieldsForType (type) {
    return fields.map(function getFieldName (field) {
      if ((type === 'book' || type === 'movie') && field === 'title') {
        return `${type}.${type}_${field}`
      } else {
        return `${type}.${field}`
      }
    })
  })
  const options = {
    lang: '*',
    page,
    pageSize: 100,
    // fetch: [...parentPageFieldIDs.concat(titleFields)]
    fetch: [].concat(...documentFields)
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
      if (doc.uid === __('quotes')) return `/${locale}/${__('quotes')}`
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
