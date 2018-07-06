var html = require('nanohtml')
var { asText, asHtml } = require('prismic-richtext')
var { className } = require('../base/utils')

module.exports = card
function card ({
    title,
    body,
    cta = {},
    image,
    category,
    divider,
    layout = 'vertical'
  }) {
  var classes = className('Card', {
    [`Card--${layout}`]: true,
    'Card--image': image,
    'Card--body': body,
    'Card--title': title,
    'Card--cta': cta,
    'Card--image': image,
    'Card--category': category
  })
  return html`
    <div class="${classes}">
      ${ image && html`<div class="Card-media">${Image(image)}</div>` }
      <div class="Card-content">
      ${ category && Category(category, divider) }
      ${ title && Title(Object.assign(title, {href: cta.href})) }
      ${ body && Body(body, !!title) }
      ${ cta && cta.href && CTA(cta) }
      </div>
    </div>
  `
}

function Image ({src, alt}) {
  return html`
    <div class="Card-image">
      <img class="Card-imageElm" src="${src}" alt="${alt}" />
    </div>
  `
}
function Title ({
  text,
  href = false,
  lvl = 2
}) {
  var element = `h${lvl}`
  return html`
    <${element} class="Card-title">
      ${ href
        ? html`<a href="${href}">${text}</a>`
        : text
      }
    </${element}>
  `
}
function Body (body, isLarge) {
  var classes = className('Card-body', {
    'Card-body--large': isLarge
  })
  // TODO: if strong spans entire text, set class to change to bold and remove strong
  return html`
    <div class="${classes}">
      ${body}
    </div>
  `
}
function Category (label, divider) {
  return html`
    <div class="Card-category">
      ${label}
      <div class="Card-divider">---</div>
    </div>
  `
}
function CTA ({href, label}) {
  return html`
    <a class="Card-cta" href="${href}">${label}</a>
  `
}
