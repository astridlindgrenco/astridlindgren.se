'use strict'

/**
 * Returns html dom for {primaryNav, SecondaryNav}.
 * Designed only for the Document link type.
 */

const html = require('nanohtml')

module.exports = function navigation (document) {
  if (!document || !document.data) return { }

  const primaryLinks = document.data.primary_links
  const primaryHtml = links2html(primaryLinks)
  const secondaryLinks = document.data.secondary_links
  const secondaryHtml = links2html(secondaryLinks)
  return {primaryHtml: primaryHtml, secondaryHtml: secondaryHtml}
}

function links2html (links) {
  return html`
    <li class="Header-navItem">
      ${links.map(link => linkItem(link))}
    </li>
  `
}

function linkItem (link) {
  if (link.source.isBroken === false) {
    const href = `/${link.source.lang.substring(0, 2)}/${link.source.uid}`
    return html`
      <a class="Header-link ${link.isActive ? 'Header-link--active' : ''}" href="${href}">
        ${link.label}
      </a>
    `
  }
}
