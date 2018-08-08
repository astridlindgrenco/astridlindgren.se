'use strict'

/**
 * Responsibilities
 * - Make URL's pretty according to doc types.
 * - Add language where needed.
 * - Handle fallback when needed.
 */

module.exports = function linkResolver (doc, ctx) {
  console.log(doc)
  let lang = ''
    // Check if language should be part of the URL
  if (doc.lang !== 'sv-se') {
    lang = '/' + doc.lang
  }
  // Create the URL according to doc type
  if (doc.isBroken === true) {
    return lang + '/404'
  }
  if (doc.type === 'page') {
    return lang + '/' + doc.uid
  }
  return '/'
}
