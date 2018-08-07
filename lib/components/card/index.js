var html = require('nanohtml')
var asElement = require('prismic-element')
var { asText } = require('prismic-richtext')
var { className } = require('../base/utils')
var Category = require('../category')

module.exports = card
function card ({
    card_title: title,
    card_title_link: title_link,
    card_body: body,
    card_more_label: more_label,
    card_more_link: more_link,
    card_image: image,
    category,
    divider,
    layout = 'vertical'
  }) {
  var hasTitle = Boolean(title.length)
  var classes = className('Card', {
    [`Card--${layout}`]: true,
    'Card--image': image.url,
    'Card--body': body,
    'Card--title': hasTitle,
    'Card--moreLink': more_link,
    'Card--image': image,
    'Card--category': category
  })
  return html`
    <div class="${classes}">
      ${ image.url ? html`<div class="Card-media">${Image(image)}</div>` : '' }
      <div class="Card-content">
      ${ category ? html`<div class="Card-category">${Category(category, divider)}</div>` : '' }
      ${ hasTitle ? Title(title[0], '#' || title_link) : '' }
      ${ body ? Body(body, hasTitle) : '' }
      ${ more_label ? MoreLink({ label: more_label, href: '#' || more_link }) : '' }
      </div>
    </div>
  `
}

function Image ({url, alt}) {
  return html`
    <div class="Card-image">
      <img class="Card-imageElm" src="${url}" alt="${alt}" />
    </div>
  `
}
function Title (
  title,
  href = false
) {
  var { text, type } = title
  var element = `h${type.substr(-1)}`
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
      ${asElement(body)}
    </div>
  `
}
function MoreLink ({href, label}) {
  return html`
    <a class="Card-moreLink" href="${href}">${label}</a>
  `
}
