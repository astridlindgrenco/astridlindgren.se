const MAX_HTTP_FAILS = 50
const HTTP_URL = process.env.PRISMIC_API + '/documents/search'

const { __ } = require('./locale')
const request = require('sync-request')
const fs = require('fs')

/**
 * Responsibilities
 * - Make URL's pretty according to doc types.
 * - Add language where needed.
 * - Handle fallback when needed.
 */
module.exports = function linkResolver (doc, ctx) {
  if (!doc || !doc.lang || (doc.link_type && doc.link_type === 'Any')) {
    return
  }

  if (doc.link_type === 'Media' || doc.link_type === 'Web') {
    return doc.url
  }

  if (!doc.link_type || (doc.link_type && doc.link_type === 'Document')) {
    const langCode = doc.lang

    if ((doc.type === 'page') && doc.uid) {
      doc.default_uid = doc.uid
      let path = getPathRecursive(doc)

      if (path.length > 0) {
        if (doc.type === 'listpage') {
          if (doc.uid === __('booklist')) path = '/' + __('booklist') + path
          if (doc.uid === __('movielist')) path = '/' + __('movielist') + path
        }
        return `/${langCode}` + path
      }
    }

    // Create the URL according to doc type
    switch (doc.type) {
      case 'home':
        return `/${langCode}`
      case 'page':
        return `/${langCode}/${doc.uid}`
      case 'book':
        return `/${langCode}/${__('book')}/${doc.uid}`
      case 'listpage':
        if (doc.uid === __('booklist')) return `/${langCode}/${__('booklist')}`
        if (doc.uid === __('movielist')) return `/${langCode}/${__('movielist')}`
        break
      case 'newsdesk':
        return `/${langCode}/${__('newsdesk')}`
      case 'citatsida':
        return `/${langCode}/${__('quotes')}`
      default:
        return '/'
    }
  }
  return doc.url
}

// This really needs to get improved
// Currently its sync, while it tbh should be async and maybe even
// multi-threaded?
let ref
function getPathRecursive (doc, result, n) {
  let cacheFile = null // FIXME: Clear on prismic hook
  try {
    cacheFile = require('../cache.json')
  } catch (ex) {
    fs.writeFileSync('./cache.json', '{}')
    cacheFile = require('../cache.json')
  }

  if (cacheFile[doc.default_uid]) {
    return cacheFile[doc.default_uid]
  }

  if (!result) result = ''
  if (!n) n = 1

  // if (n > 2) return result

  // This is ugly and slow, would be a lot better if we could get async working here
  if (!ref) {
    n++
    ref = JSON.parse((request('GET', process.env.PRISMIC_API, {
      qs: {
        lang: doc.lang
      }
    }).body)).refs[0].ref
  }

  let res = request('GET', HTTP_URL, {
    qs: {
      ref: ref,
      q: '[[at(my.' + doc.type + '.uid,"' + doc.uid + '")]][[fetch(parent_page)]]',
      lang: doc.lang
    }
  })

  if (res.statusCode !== 200 || !res.body) {
    n++
    if (n >= MAX_HTTP_FAILS) return '/' + doc.default_uid

    console.log('[Resolve] Http failed:', res)
    getPathRecursive(doc, result, n)
  }

  const item = JSON.parse(res.body.toString()).results[0]

  result = '/' + item.uid + result

  if (!item.data.parent_page || !item.data.parent_page.uid) {
    console.log('[Resolve] (' + n + ')', 'UID:', doc.default_uid, 'Path:', result)
    ref = null

    cacheFile[doc.default_uid] = result
    fs.writeFileSync('./cache.json', JSON.stringify(cacheFile))
    return result
  }

  doc.uid = item.data.parent_page.uid
  n++

  return getPathRecursive(doc, result, n)
}
