const html = require('nanohtml')
const resolve = require('../../resolve')

let Footer = (data, ctx) => {
  // Fail if linkedDocuments.footer_ref is null or undefined
  if (!data || !data.values().next().value) return html``

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
                <a class="Footer-content-linksblock-link" href="${resolve(item.link, ctx)}">${item.title}</a>
              `
            })}
          </div>
        `
      })}
    </div>
    <div class="Footer-copyright">Copyright © ${(new Date()).getFullYear()} ${data.company_info}</div>
  </footer>
  `
}

module.exports = Footer
