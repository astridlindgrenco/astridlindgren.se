'use strict'

/**
 * Responsibilities
 * - Make URL's pretty for selected doc types.
 * - Handle language where needed.
 * - Handle fallback when needed.
 */

module.exports = function linkResolver(doc, ctx) {
    // TODO add language handling
    if (doc.isBroken === true) {
      return '/404'
    }
    if (doc.type === 'page') {
        return '/' + doc.uid;
    }
    return '/';
  }