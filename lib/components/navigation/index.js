'use strict'

/**
 * Returns html dom for {primaryNav, SecondaryNav}.
 * Designed only for the Document link type.
 */

const html = require('nanohtml')

module.exports = function navigation (document, useLang = false) {
  const primaryLinks = document.data.primary_links
  const primaryHtml = links2html(primaryLinks, useLang)
  const secondaryLinks = document.data.secondary_links
  const secondaryHtml = links2html(secondaryLinks, useLang)
  return {primaryHtml: primaryHtml, secondaryHtml: secondaryHtml}
}

function links2html (links, useLang) {
  return html`
    <li class="Header-navItem">
      ${links.map(link => linkItem(link, useLang))}
    </li>
  `
}

function linkItem (link, useLang) {
  let href = '/' + (useLang ? link.source.lang : '') + link.source.slug
  return html`
    <a class="Header-link ${link.isActive ? 'Header-link--active' : ''}" href="${href}">
      ${link.label}
    </a>
  `
}
