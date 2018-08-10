var html = require('nanohtml')
var asElement = require('prismic-element')
var { inBrowser, className, toCamelCase, ucFirst } = require('../base/utils')
var palette = require('../base/palette')
var Image = require('./image')
var Category = require('../category')
var serializer = require('../text/serializer')
var linkResolver = require('../../resolve')

module.exports = card
function card ({
    title,
    titleLink,
    body,
    moreLabel,
    moreLink,
    image,
    category,
    divider,
    bg,
    layout = 'vertical'
  }) {
  var hasTitle = Boolean(title.length)
  var hasBody = Boolean(body.length)
  var hasBg = Boolean(bg)
  if (hasBg) {
    var color = palette.find(color => color.human_name === bg)
    if (color) {
      bg = ucFirst(toCamelCase(color.id, '_'))
    }
  }
  var classes = className('Card', {
    [`Card--${layout}`]: true,
    [`Card--bg${bg}`]: hasBg,
    'Card--image': image.url,
    'Card--body': hasBody,
    'Card--title': hasTitle,
    'Card--moreLink': moreLink,
    'Card--category': category
  })
  return html`
    <div class="${classes}">
      ${image.url ? html`<div class="Card-media">${Image(image, !hasBody)}</div>` : ''}
      <div class="Card-content">
      ${category ? html`<div class="Card-category">${Category(category, divider)}</div>` : ''}
      ${hasBody || hasTitle ? Body(body, title, hasBg) : ''}
      ${moreLabel ? MoreLink({ label: moreLabel, href: '#' || moreLink }) : ''}
      </div>
    </div>
  `
}

function Body (body, title, hasBg) {
  var classes = className('Text', {
    'Text--full': true,
    'Text--adaptive': hasBg
  })
  // TODO: if strong spans entire text, set class to change to bold and remove strong
  return html`
    <div class="Card-body">
      <div class="${classes}">
        ${asElement(title, linkResolver, serializer({
          classes: {
            heading2: {
              'Text-h3': body.length,
              'Text-h1': !body.length
            }
          }
        }))}
        ${asElement(body, linkResolver, serializer())}
      </div>
    </div>
  `
}
function MoreLink ({href, label}) {
  return html`
    <a class="Card-moreLink" href="${href}">${label}</a>
  `
}
