'use strict'

/**
 * Responsibilities
 * - Make URL's pretty for selected doc types.
 * - Handle language where needed.
 * - Handle fallback when needed.
 */

module.exports = function linkResolver(doc, ctx) {
    let lang = ''
    // Check language
    if (doc.lang !== 'sv-se') {
        lang = '/' + doc.lang;
    }
    if (doc.isBroken === true) {
      return lang + '/404'
    }
    if (doc.type === 'page') {
        return lang + '/' + doc.uid
    }
    return '/'
  }
