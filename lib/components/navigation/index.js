'use strict'

/**
 * Returns html for {primaryNav, SecondaryNav}.
 * Designed only for the Document link type.
 */

const html = require('nanohtml')

module.exports = function navigation(document, useLang = false) {
    const primaryLinks = document.data.primary_links
    const primaryHtml = links2html(primaryLinks, useLang)
    const secondaryLinks = document.data.secondary_links
    const secondaryHtml = links2html(secondaryLinks, useLang)
    return {primaryHtml: primaryHtml, secondaryHtml: secondaryHtml}
}

function links2html(links, useLang) {
  let html = ''
  links.forEach(link => {
    let href = '/' + (useLang ? link.source.lang : '') + link.source.slug
    html += `
    <li class="Header-navItem">
      <a class="Header-link" href="${href}">
        ${link.label}
      </a>
    </li>`
  })
  return html
}
