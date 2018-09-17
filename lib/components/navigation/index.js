'use strict'

/**
 * Returns html dom for {primaryNav, SecondaryNav}.
 * Designed only for the Document link type.
 */

const html = require('nanohtml')

module.exports = function navigation (document) {
  if (!document || !document.data) return { }

  const primaryLinks = document.data.primary_links
  const primaryHtml = links(primaryLinks)
  const secondaryLinks = document.data.secondary_links
  const secondaryHtml = links(secondaryLinks)
  return {primaryHtml: primaryHtml, secondaryHtml: secondaryHtml}
}

function links (links) {
  return links.map(link => linkItem(link))
}

function linkItem (link) {
  if (link.source.isBroken) return ''
  const href = `/${link.source.lang.substring(0, 2)}/${link.source.uid}`
  return html`
    <li class="Header-navItem">
      <a class="Header-link ${link.isActive ? 'Header-link--active' : ''}" href="${href}">
        ${link.label}
      </a>
    </li>
  `
}
