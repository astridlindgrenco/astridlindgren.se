'use strict'

/**
 * Returns html for {primaryNav, SecondaryNav}
 */

const html = require('nanohtml')

module.exports = function navigation(document, useLang = false) {
    const primaryLinks = document.data.primary_links
    let primaryHtml = ''
    primaryLinks.forEach(link => {
      // create href according to link type
      let href = null;
      if (link.source.link_type === 'Document') {
        href = '/'
        href += useLang ? link.source.lang : ''  
        href += link.source.slug
      }
      // create html for link
      primaryHtml += `
      <li class="Header-navItem">
        <a class="Header-link" href="${href}">
          ${link.label}
        </a>
      </li>`
    })
    return {primaryHtml: primaryHtml, secondaryHtml: null}
}
