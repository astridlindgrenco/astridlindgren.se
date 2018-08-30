const { __ } = require('./locale')
const request = require('sync-request')

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

    if ((doc.type === 'page' || doc.type === 'booklist') && ctx && doc.uid) {
      let path = getPathRecursive(doc, ctx)

      if (path.length > 0) {
        if (doc.type === 'booklist') path = '/' + __('booklist') + path

        console.log('[Resolve] Path: ' + path)
        return `/${langCode}` + path
      }
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

const httpUrl = process.env.PRISMIC_API + '/documents/search'
function getPathRecursive (doc, ctx, result) {
  if (!result) result = ''

  // This is ugly and slow, would be a lot better if we could get asyn working here
  let ref = JSON.parse((request('GET', process.env.PRISMIC_API, {
    qs: {
      lang: doc.lang
    }
  }).body)).refs[0].ref

  let res = request('GET', httpUrl, {
    qs: {
      ref: ref,
      q: '[[at(my.' + doc.type + '.uid,"' + doc.uid + '")]]',
      lang: doc.lang
    }
  })

  const item = JSON.parse(res.body.toString()).results[0]

  result = ('/' + ((item.uid === 'booklist') ? __('booklist') : item.uid)) + result

  if (!item.data.parent_page || !item.data.parent_page.uid) return result

  doc.uid = item.data.parent_page.uid
  return getPathRecursive(doc, ctx, result)
}
