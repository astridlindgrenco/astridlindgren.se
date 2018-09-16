const MAX_HTTP_FAILS = 50
const HTTP_URL = process.env.PRISMIC_API + '/documents/search'

const { __ } = require('./locale')
const request = require('sync-request')

/**
 * Responsibilities
 * - Make URL's pretty according to doc types.
 * - Add language where needed.
 * - Handle fallback when needed.
 */
module.exports = function linkResolver (db, doc) {
  if (!doc || !doc.lang || (doc.link_type && doc.link_type === 'Any')) {
    return
  }

  if (doc.link_type === 'Media' || doc.link_type === 'Web') {
    return doc.url
  }

  if (!doc.link_type || (doc.link_type && doc.link_type === 'Document')) {
    const locale = doc.lang.substring(0, 2)
    if ((doc.type === 'page') && doc.uid) {
      doc.default_uid = doc.uid
      let path = getPathRecursive(db, doc)

      if (path.length > 0) {
        if (doc.type === 'listpage') {
          if (doc.uid === __('booklist')) path = '/' + __('booklist') + path
          if (doc.uid === __('movielist')) path = '/' + __('movielist') + path
        }
        return `/${locale}` + path
      }
    }

    // Create the URL according to doc type
    switch (doc.type) {
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
  return doc.url
}

// This really needs to get improved
// Currently its sync, while it tbh should be async and maybe even
// multi-threaded?
let ref
function getPathRecursive (db, doc, result, n) {
  const key = doc.default_uid
  const link = db ? db.get(key) : false
  if (link) return link

  if (!result) result = ''
  if (!n) n = 1

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
    getPathRecursive(db, doc, result, n)
  }

  const item = JSON.parse(res.body.toString()).results[0]
  result = '/' + item.uid + result

  // If top level
  if (!item.data.parent_page || !item.data.parent_page.uid) {
    console.log('[Resolve] (' + n + ')', 'UID:', doc.default_uid, 'Path:', result, 'db:', !!db)
    ref = null
    if (db) {
      db.set(key, result)
    }
    return result
  }

  doc.uid = item.data.parent_page.uid

  return getPathRecursive(db, doc, result, ++n)
}
