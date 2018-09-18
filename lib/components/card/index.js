var html = require('nanohtml')
var { asText } = require('prismic-richtext')
var asElement = require('prismic-element')
var { className } = require('../base/utils')
var FontClass = require('../base/fonts')
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
    isLargerText,
    isReversed,
    isFullWidth
  }, state) {
  var hasTitle = Boolean(title && title.length)
  var hasBody = Boolean(body.length)
  var hasBg = Boolean(bg)
  var hasImg = Boolean(image.url)
  var bgClassName
  if (hasBg) {
    bgClassName = palette.getClassName(bg)
  }
  var classes = className('Card', {
    [`Card--horisontal`]: layout === 'horisontal',
    [`Card--vertical`]: layout === 'vertical',
    [`Card--bg${bgClassName}`]: hasBg,
    'Card--image': hasImg,
    'Card--body': hasBody,
    'Card--title': hasTitle,
    'Card--moreLink': moreLink,
    'Card--category': category,
    'Card--reversed': isReversed,
    'Card--fullWidth': isFullWidth
  })
  return html`
    <div class="${classes}">
      ${hasImg ? html`<div class="Card-media">${Image(image, isFullWidth || !hasBody)}</div>` : ''}
      <div class="Card-content${layout === 'horisontal' ? ' u-paddedBox' : ''}">
      ${category ? html`<div class="Card-category"> ${Category(category, (hasBody && layout === 'horisontal' ? false : divider))} </div>` : ''}
      ${hasBody || hasTitle ? Body(body, { title, titleLink }, isLargerText, hasBg, hasTitle, layout, state) : ''}
      ${moreLabel ? MoreLink({ label: moreLabel, href: moreLink }, state) : ''}
      </div>
    </div>
  `
}

function Body (body, { title, titleLink }, isLargerText, hasBg, hasTitle, layout, state) {
  var isHorisontal = layout === 'horisontal'
  var isLongBody = body.length && isHorisontal ? asText(body).length > 150 : false
  var classes = className('Text', {
    'Text--full': true,
    'Text--growing': isLargerText,
    'Text--adaptive': hasBg
  })
  if (hasTitle && titleLink) {
    title[0].spans.push({
      start: 0,
      end: title[0].text.length,
      type: 'hyperlink',
      data: titleLink
    })
  }

  let text = {
    classes: {
      heading2: {
        'Text-h3': body.length,
        'Text-huge': !body.length
      }
    }
  }

  if (state && state.font) text.classes.heading2[FontClass(state.font)] = true

  return html`
    <div class="Card-body">
      <div class="${classes}">
        ${asElement(title, linkResolver, serializer(text))}
        ${isLongBody
          ? html`<div class="Text-small">${asElement(body, linkResolver, serializer())}</div>`
          : asElement(body, linkResolver, serializer())
        }
      </div>
    </div>
  `
}

function MoreLink ({href, label}, state) {
  let link = linkResolver(state.db, {lang: state.lang, ...href})
  return html`
    <a class="Card-moreLink" href="${link}">${label}</a>
  `
}
