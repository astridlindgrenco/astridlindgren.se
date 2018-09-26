const fs = require('fs')
const linkmapTtlInMs = process.env.LINK_CACHE_TTL_MS || 600000

let linkmap = new Map(JSON.parse(fs.readFileSync('links.map')))
let linkmapTimestamp = Date.now()
console.log('[Resolve]: load link map', linkmap.size)

/**
 * Responsibilities
 * - Make URL's pretty according to doc types.
 * - Add language where needed.
 * - Handle fallback when needed.
 */
module.exports = {linkResolver, docResolver}

function linkResolver (doc) {
  if (!doc || !doc.lang || (doc.link_type && doc.link_type === 'Any')) {
    return
  }

  if (doc.link_type === 'Media' || doc.link_type === 'Web') {
    return doc.url
  }

  if (Date.now() - linkmapTimestamp > linkmapTtlInMs) {
    linkmap = new Map(JSON.parse(fs.readFileSync('links.map')))
    console.log('[Resolve]: reload link map', linkmap.size)
    if (linkmap.size < 0) return linkResolver(doc)
    linkmapTimestamp = Date.now()
  }

  const resolvedDoc = docResolver(doc)
  if (resolvedDoc) return resolvedDoc.path

  console.log('[Resolve]: MISS!', doc.link_type, doc.id, doc.lang, doc.type, doc.uid)
  return null
}

function docResolver (doc) {
  if (doc && doc.id) {
    const resolvedDoc = linkmap.get(doc.id)
    if (resolvedDoc) return resolvedDoc
  }
  return null
}
