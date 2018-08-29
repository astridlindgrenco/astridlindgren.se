const { __ } = require('./locale')
// const request = require('sync-request')

/**
 * Responsibilities
 * - Make URL's pretty according to doc types.
 * - Add language where needed.
 * - Handle fallback when needed.
 */
module.exports = function linkResolver (doc, ctx) {
  if (!doc || !doc.link_type || doc.link_type === 'Any') return

  if (!ctx) console.log('[Resolve] \x1b[31mctx isn\'t passed to linkResolver!\x1b[0m Falling back to backup linkResolver (doesn\'t handle deep paths).')

  if (doc.type && doc.lang && doc.uid) console.log(`[Resolve] Resolve link (${doc.type}): ${doc.lang}/${doc.uid}`)

  if (doc.link_type === 'Document') {
    const langCode = doc.lang.substr(0, 2)

    if (doc.type === 'page' && ctx && doc.uid) {
      // return `/${langCode}` + getPathRecursive(doc, ctx)
    }

    // Create the URL according to doc type
    switch (doc.type) {
      case 'home':
        return `/${langCode}`
      case 'page':
        return `/${langCode}/${doc.uid}`
      case 'booklist':
        return `/${langCode}/${__('booklist')}`
      case 'newsdesk':
        return `/${langCode}/${__('newsdesk')}`
      case 'citatsida':
        return `/${langCode}/${__('quotes')}`
    }
    return '/'
  }
  return doc.url
}

/* const httpUrl = process.env.PRISMIC_API + '/documents/search'
function getPathRecursive (doc, ctx, result) {
  if (!result) result = '/'

  let res = request('GET', httpUrl, {
    qs: {
      ref: 'master',
      q: '[[at(my.page.uid,"' + doc.uid + '")]]',
      access_token: process.env.PRISMIC_ACCESS_TOKEN,
      lang: doc.lang
    }
  })

  const item = JSON.parse(res.body.toString())

  result += '/' + item.uid

  if (!item.data.parent_page || !item.data.parent_page.uid) return result

  doc.uid = item.data.parent_page.uid
  return getPathRecursive(doc, ctx, result)
} */
