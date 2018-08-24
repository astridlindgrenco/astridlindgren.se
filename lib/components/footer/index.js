const html = require('nanohtml')

let Footer = (data) => {
  // Fail if linkedDocuments.footer_ref is null or undefined
  if (!data || !data.values().next().value) {
    console.warn('ContactInfo: data is undefined')
    return html``
  }

  // Set data to actual body
  data = data.values().next().value.data

  return html`
  <footer>
    <img src="/al_logo_white.svg" alt="Astrid Lindgren Company" class="Logo Footer-logo"/>
    <div class="Footer-content">
      ${data.body.map((item) => {
        return html`
          <div class="Footer-content-linksblock">
            <span class="Footer-content-linksblock-title">${item.primary.title}</span>
            ${item.items.map((item) => {
              return html`
                <a class="Footer-content-linksblock-link" href="${linkToHref(item.link)}">${item.title}</a>
              `
            })}
          </div>
        `
      })}
    </div>
    <div class="Footer-copyright">Copyright © 2005-${(new Date()).getFullYear()} ${data.company_info}</div>
  </footer>
  `
}

/**
 * Convert prismic link object into link
 *
 * TODO: Create module out of this
 *
 * @param {link} prismicLink
 */
let linkToHref = (link) => {
  if (link.link_type === 'Document' && link.uid) return '/' + link.uid
  else if (link.link_type === 'Web') return link.url

  return '/404'
}
module.exports = Footer
