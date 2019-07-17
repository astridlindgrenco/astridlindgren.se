const fs = require('fs')
const linkmapTtlInMs = process.env.LINK_CACHE_TTL_MS || 600000

let linkmap = null
let linkmapTimestamp = null
reloadLinkmap()

/**
 * Responsibilities
 * - Make URL's pretty according to doc types.
 * - Add language where needed.
 * - Handle fallback when needed.
 */
module.exports = { linkResolver, docResolver, getPathById, getParents, getImmediateChildren, getSiblings, reloadLinkmap }

function reloadLinkmap () {
  const LINKMAP_FILENAME = 'links.map'
  console.log('open')
  // in case link cache file is missing
  try {
    console.log('check')
    fs.accessSync(LINKMAP_FILENAME, fs.F_OK)
  } catch (err) {
    fs.writeFileSync(LINKMAP_FILENAME, JSON.stringify([...new Map()]))
  }

  linkmap = new Map(JSON.parse(fs.readFileSync(LINKMAP_FILENAME)))
  console.log('[Resolve]: reload link map', linkmap.size)
  linkmapTimestamp = Date.now()
}

function linkResolver (doc) {
  if (!doc || (doc.link_type && doc.link_type === 'Any')) {
    return
  }

  if (doc.link_type === 'Media' || doc.link_type === 'Web') {
    return doc.url
  }

  if (Date.now() - linkmapTimestamp > linkmapTtlInMs) {
    reloadLinkmap()
  }

  const resolvedDoc = docResolver(doc)
  if (resolvedDoc) {
    return resolvedDoc.path
  }

  console.log('[Resolve]: linkResolver MISS!', JSON.stringify(doc).replace(/(,|:)/g, '$1 '))
  return null
}

/**
 * Returns a object from the linkmap (containing information for links and menu items).
 * @param {object} doc - A document object containing a Prismic document 'id'
 */
function docResolver (doc) {
  return doc && doc.id ? linkmap.get(doc.id) : null
}

function getPathById (id) {
  if (id) {
    const resolvedDoc = linkmap.get(id)
    if (resolvedDoc) return resolvedDoc.path
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
 * Returns all siblings of a Prismic document (docs that share the same immedieate parent) found in the links.map
 * @param  {String} docID       A Prismic document ID
 * @return {Array}              An array of parents from links.map
 */
function getSiblings (docID) {
  var linkDoc = linkmap.get(docID)
  var siblings = []
  for (var [possibleSiblingID, possibleSibling] of linkmap.entries()) {
    if (possibleSibling.parentId === linkDoc.parentId) {
      possibleSibling.id = possibleSiblingID // Add ID, handy to determine active trail in navigation
      siblings.push(makeCopyOfObject(possibleSibling)) // Make sure we don't link object to linkmap (there have been bugs on that)
    }
  }
  return siblings
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
      parents.push(makeCopyOfObject(parent)) // Make sure we don't link object to linkmap (there have been bugs on that)
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
        children.push(makeCopyOfObject(child)) // Make sure we don't link object to linkmap (there have been bugs on that)
      }
    }
  }
  return children
}

/**
 * Takes an object and returns a NON LINKED copy
 * @param  {Object} obj A plain javascript object
 * @return {Object}     A new object that lost it's possible linkage
 */
function makeCopyOfObject (obj) {
  return Object.assign({}, obj)
}
