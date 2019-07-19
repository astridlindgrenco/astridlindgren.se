const html = require('nanohtml')
const Section = require('../section')
const { linkResolver, docResolver } = require('../../resolve')

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
      while (docs[0] && docs[0].parentId) {
        docs = [docResolver({ id: docs[0].parentId })].concat(docs)
      }
      breadcrums = html`
      <div class="Footer-breadcrums">
        <span>/</span><a href="/${ctx.state.locale}">${ctx.state.locales.homeTitle}</a>
        ${docs.map((doc) => {
    if (doc && doc.path && doc.title) {
      return html`<span>/</span><a href="${doc.path}">${doc.title}</a>`
    }
  })}
      </div>
    `
    }
  }

  if (data.social_icons) {
    socialLinks = html`
      <div class="Footer-social">
        ${data.social_icons.map((item) => {
    return html`<div class="Footer-social-item"><a href="${item.link.url}" target="${item.link.target ? item.link.target : '_self'}"><img src="${item.icon.url}"/></a></div>`
  })}
      </div>
    `
  }

  return html`
    <footer>
    ${Section({
    bg: 'Svart',
    body: html`
        <img src="/al_logo_white.svg" alt="Astrid Lindgren Company" class="Logo Footer-logo"/>
        <div class="Footer-content">
          <div class="Grid Grid--withGutter u-lg-flexJustifyBetween">
          ${data.body.map((item) => {
    return html`
              <div class="Grid-cell u-md-size1of2 u-lg-sizeFit">
                <div class="Footer-list">
                  <div class="Text Text--adaptive">
                    <p class="Footer-title Text-small">${item.primary.title}</p>
                    <ul class="Footer-linkList Text-linkList Text-small">
                      ${item.items.map((item) => {
    const url = linkResolver(item.link)
    return html`
                          <li><a class="Footer-content-linksblock-link" href="${url}" target="${item.link.target ? item.link.target : '_self'}">${item.title}</a></li>
                        `
  })}
                    </ul>
                  </div>
                </div>
              </div>
            `
  })}
          </div>
          <div class="Footer-footer">
          ${breadcrums}
          ${socialLinks}
          </div>
        </div>

      `
  })}
    <div class="Footer-copyright">Copyright © ${(new Date()).getFullYear()} ${data.company_info}</div>
    </footer>
  `
}

module.exports = Footer
