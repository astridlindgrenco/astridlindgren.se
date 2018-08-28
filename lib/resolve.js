const { __ } = require('./locale')

/**
 * Responsibilities
 * - Make URL's pretty according to doc types.
 * - Add language where needed.
 * - Handle fallback when needed.
 */

module.exports = function linkResolver (doc, ctx) {
  if (!doc || !doc.type || !doc.uid) return

  console.log(`[Resolve] Resolve link ${doc.type}: ${doc.lang} ${doc.uid}`)
  if (doc.link_type === 'Document') {
    const langCode = doc.lang.substr(0, 2)
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
