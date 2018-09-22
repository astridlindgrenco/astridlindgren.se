const fs = require('fs')
const linkmapTtlInMs = process.env.LINK_CACHE_TTL_MS || 10000

let linkmap = new Map(JSON.parse(fs.readFileSync('links.map')))
let linkmapTimestamp = Date.now()
console.log('[Resolve]: load link map', linkmap.size)

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

  if (doc.id) {
    if (Date.now() - linkmapTimestamp > linkmapTtlInMs) {
      linkmap = new Map(JSON.parse(fs.readFileSync('links.map')))
      console.log('[Resolve]: reload link map', linkmap.size)
      linkmapTimestamp = Date.now()
    }
    const path = linkmap.get(doc.id)
    if (path) return path
  }
  console.log('[Resolve]: MISS!', doc.link_type, doc.id, doc.lang, doc.type, doc.uid)
  return null
}
