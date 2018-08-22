const html = require('nanohtml')
const raw = require('nanohtml/raw')

let Footer = (data) => {
  // Fail if linkedDocuments.footer_ref is null or undefined
  if (!data) return html``

  // Set data to actual body
  data = data.values().next().value.data.body

  // Loop through every linkblock in footer and add generate HTML
  let output = ''
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    output += '<div class="footer--linksblock">' + '<span class="footer--linksblock--title">' + item.primary.title + '</span>'

    for (let ii = 0; ii < item.items.length; ii++) {
      output += '<a class="footer--linksblock--link" href="' + (linkToHref(item.items[ii].link)) + '">' + item.items[ii].title + '</a>'
    }

    output += '</div>'
  }

  return html`
  <footer>
    ${raw(output)}
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
