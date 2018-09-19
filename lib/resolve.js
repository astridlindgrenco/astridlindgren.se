const fs = require('fs')

/**
 * Responsibilities
 * - Make URL's pretty according to doc types.
 * - Add language where needed.
 * - Handle fallback when needed.
 */
module.exports = function linkResolver (doc) {
  if (!doc || !doc.lang || (doc.link_type && doc.link_type === 'Any')) {
    return
  }

  if (doc.link_type === 'Media' || doc.link_type === 'Web') {
    return doc.url
  }

  if (!doc.link_type || (doc.link_type && doc.link_type === 'Document')) {
    const key = doc.lang + '-' + doc.type + '-' + doc.uid
    const linkmap = new Map(JSON.parse(fs.readFileSync('links.map')))
    const path = linkmap.get(key)
    console.log('linkResolver', key, path)
    if (path) return path
  }
  return '/'
}
