var html = require('nanohtml')
var { asText } = require('prismic-richtext')
var asElement = require('prismic-element')
var { inBrowser, className } = require('../base/utils')
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
    layout = 'vertical',
    isReversed,
    isFullWidth
  }) {
  var hasTitle = Boolean(title.length)
  var hasBody = Boolean(body.length)
  var hasBg = Boolean(bg)
  var bgClassName;
  if (hasBg) {
    bgClassName = palette.getClassName(bg)
  }
  var classes = className('Card', {
    [`Card--horisontal`]: layout === 'horisontal',
    [`Card--vertical`]: layout === 'vertical',
    [`Card--bg${bgClassName}`]: hasBg,
    'Card--image': image.url,
    'Card--body': hasBody,
    'Card--title': hasTitle,
    'Card--moreLink': moreLink,
    'Card--category': category,
    'Card--reversed': isReversed,
    'Card--fullWidth': isFullWidth
  })
  return html`
    <div class="${classes}">
      ${image.url ? html`<div class="Card-media">${Image(image, isFullWidth || !hasBody)}</div>` : ''}
      <div class="Card-content${layout === 'horisontal' ? ' u-paddedBox' : ''}">
      ${category ? html`<div class="Card-category"> ${Category(category, (hasBody && layout === 'horisontal' ? false : divider))} </div>` : ''}
      ${hasBody || hasTitle ? Body(body, { title, titleLink }, hasBg, layout) : ''}
      ${moreLabel ? MoreLink({ label: moreLabel, href: '#' || moreLink }) : ''}
      </div>
    </div>
  `
}

function Body (body, { title, titleLink }, hasBg, layout) {
  var isLongBody = body.length && layout === 'horisontal' ? asText(body).length > 150 : false
  var classes = className('Text', {
    'Text--full': true,
    'Text--adaptive': hasBg
  })
  if (title.length && titleLink) {
    title[0].spans.push({
      start: 0,
      end: title[0].text.length,
      type: 'hyperlink',
      data: titleLink
    })
  }
  return html`
    <div class="Card-body">
      <div class="${classes}">
        ${asElement(title, linkResolver, serializer({
          classes: {
            heading2: {
              'Text-h3': body.length,
              'Text-huge': !body.length
            }
          }
        }))}
        ${isLongBody
          ? html`<div class="Text-small">${asElement(body, linkResolver, serializer())}</div>`
          : asElement(body, linkResolver, serializer())
        }
      </div>
    </div>
  `
}

function MoreLink ({href, label}) {
  return html`
    <a class="Card-moreLink" href="${href}">${label}</a>
  `
}
