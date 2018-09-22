const html = require('nanohtml')
const {linkResolver, docResolver} = require('../../resolve')

let Footer = (data, ctx) => {
  // Fail if linkedDocuments.footer_ref is null or undefined
  if (!data || !data.values().next().value) return html``

  // Set data to actual body
  data = data.values().next().value.data

  let breadcrums = ''
  let socialLinks = ''

  if (ctx && ctx.state && ctx.state.params && Array.isArray(ctx.state.params)) {
    const page = ctx.state.pages.items[0]
    let docs = [docResolver(page)]
    if (Array.isArray(docs) && docs.length > 0) {
      while (docs[0].parentId) {
        docs = [docResolver({id: docs[0].parentId})].concat(docs)
      }
      breadcrums = html`
      <div class="Footer-breadcrums">
        <span>/</span><a href="/${ctx.state.locale}">${ctx.state.locales.homeTitle}</a>
        ${docs.map((doc) => {
          return html`<span>/</span><a href="${doc.path}">${doc.title}</a>`
        })}
      </div>
    `
    }
  }

  if (data.social_icons) {
    socialLinks = html`
      <div class="Footer-social">
        ${data.social_icons.map((item) => {
          return html`<div class="Footer-social-item"><a href="${item.link.url}" target="_blank"><img src="${item.icon.url}"/></a></div>`
        })}
      </div>
    `
  }

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
                <a class="Footer-content-linksblock-link" href="${linkResolver(item.link)}">${item.title}</a>
              `
            })}
          </div>
        `
      })}
    </div>
    <div class="Footer-footer">
      ${breadcrums}
      ${socialLinks}
    </div>

    <div class="Footer-copyright">Copyright © ${(new Date()).getFullYear()} ${data.company_info}</div>
  </footer>
  `
}

module.exports = Footer
