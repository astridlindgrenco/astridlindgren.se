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
module.exports = {linkResolver, docResolver, getParents, getImmediateChildren}

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

/**
 * Returns all parents of a Prismic document found in the links.map
 * @param  {String} docID          A Prismic document ID
 * @return {Array}              An array of parents from links.map
 */
function getParents (docID) {
  var linkDoc = linkmap.get(docID)
  return getParentRecurr(linkDoc)
}

/**
 * Returns all found in the linksDoc object using recursion
 * @param  {Object} linkDoc      An link object from the links.map
 * @param  {Array}  [parents=[]] Array of parent link-map objects. Defaults to an empty array (no parents)
 * @return {Array}  parents      Array of zero or more link-map objects
 */
function getParentRecurr (linkDoc, parents = []) {
  if (linkDoc && linkDoc.parentId) {
    var parent = linkmap.get(linkDoc.parentId)
    if (parent) {
      parent.id = linkDoc.parentId // Add ID, handy to determine active trail in navigation
      parents.push(parent)
      return getParentRecurr(parent, parents)
    } else return parents
  } else {
    return parents
  }
}

/**
 * Returns all IMMEDIEATE children - NOT grandchildren - of a Prismic document found in the links.map
 * @param  {String} targetParentId           A Prismic document ID
 * @return {Array} children       Array of zero or more link-map objects
 */
function getImmediateChildren (targetParentId) {
  var children = []
  if (targetParentId) {
    for (var [childId, child] of linkmap.entries()) {
      if (child.parentId === targetParentId) {
        child.id = childId // Add ID, handy to determine active trail in navigation
        children.push(child)
      }
    }
  }
  return children
}
