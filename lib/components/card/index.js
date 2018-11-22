const html = require('nanohtml')
const { asText } = require('prismic-richtext')
const asElement = require('prismic-element')
const { className } = require('../base/utils')
const { getCustomFontClass } = require('../base/fonts')
const palette = require('../base/palette')
const Image = require('./image')
const Category = require('../category')
const serializer = require('../text/serializer')
const {linkResolver} = require('../../resolve')

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

  if (!divider) divider = 'default'

  var classes = className('Card', {
    [`Card--horizontal`]: layout === 'horizontal',
    [`Card--vertical`]: layout === 'vertical',
    [`u-bg${bgClassName}`]: hasBg,
    'Card--hasBg': hasImg,
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
      ${hasImg ? html`<div class="Card-media">${Image(image, isFullWidth)}</div>` : ''}
      <div class="Card-content${layout === 'horizontal' ? ' u-paddedBox' : ''} u-colorFor${bgClassName}">
      ${category
        ? html`
          <div class="Card-category">
            ${Category(category, (
              hasBody && layout === 'horizontal'
                ? (divider !== 'default' ? divider : false)
                : divider
            ))}
          </div>`
        : ''
      }
      ${hasBody || hasTitle ? Body(body, { title, titleLink }, isLargerText, hasBg, hasTitle, layout, state) : ''}
      ${moreLabel ? MoreLink({ label: moreLabel, href: moreLink}, state) : ''}
      </div>
    </div>
  `
}

function Body (body, { title, titleLink }, isLargerText, hasBg, hasTitle, layout, state) {
  var ishorizontal = layout === 'horizontal'
  var isLongBody = body.length && ishorizontal ? asText(body).length > 150 : false
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

  if (state && state.font) text.classes.heading2[getCustomFontClass(state.font)] = true

  return html`
    <div class="Card-body">
      <div class="${classes}">
        ${asElement(title, linkResolver, serializer(text))}
        ${html`<div class="Text--article">${asElement(body, linkResolver, serializer())}</div>`}
      </div>
    </div>
  `
}

function MoreLink ({href, label}, state) {
  let link = linkResolver({lang: state.lang, ...href})
  return html`
    <a class="Card-moreLink" href="${link}" target="${href.target ? href.target : '_self'}">${label}</a>
  `
}
