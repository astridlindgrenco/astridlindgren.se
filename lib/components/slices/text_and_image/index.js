var html = require('nanohtml')
var asElement = require('prismic-element')
var serializer = require('../../text/serializer')
var {linkResolver} = require('../../../resolve')
const { getCustomFontClass } = require('../../base/fonts')
var { className } = require('../../base/utils')
var Section = require('../../section')
var { image } = require('../../base/utils/')

module.exports = richTextAndImage

/**
* Rich text and image
* 1. If it has a bg and comes directly after the main_body page text
*/
const layouts = {
  CENTERED_IMG_RIGHT: 'Vertikalt centrerad text, bild till höger',
  CENTERED_IMG_LEFT: 'Vertikalt centrerad text, bild till vänster',
  TOP_IMG_RIGHT: 'Text i toppen, bild till höger',
  TOP_IMG_LEFT: 'Text i toppen, bild till vänster'
}

function richTextAndImage (slice, state, container, ctx, prevSlice) {
  var data = slice.primary
  var hasBg = data.theme_bg_color && data.theme_bg_color !== 'Anpassad bakgrund'

  var image = data.image
  var layout = data.theme_layout || layouts.CENTERED_IMG_RIGHT

  var bodyTextHeading = {
    classes: {
      heading2: {
        'Text-h3': true
      }
    }
  }

  if (state && state.font) bodyTextHeading.classes.heading2[getCustomFontClass(state.font)] = true

  var columns = [textColumn(data.body_text, layout, bodyTextHeading), imageColumn(image, data.image_caption, data.theme_image_scale, layout)]
  if (layout === layouts.CENTERED_IMG_LEFT || layout === layouts.TOP_IMG_LEFT) columns = columns.reverse()
  return Section({
    push: true,
    pushTop: hasBg && !prevSlice, /* 1 */
    isNarrow: false,
    bg: data.theme_bg_color,
    body: html`
      <div class="Grid Grid--withGutter Grid--equalHeight">
        ${columns}
      </div>
    `
  })
}

function imageColumn (img, imgCaption, imgScale, layout) {
  const alt = img.alt

  let width = 'fw'
  const scale = Number.parseInt(imgScale)
  if (scale < 50) width = 'qw'
  else if (scale < 75) width = 'hw'
  const responsiveImg = image(img, [`${width}-small`, `${width}-medium`, `${width}-large`, `${width}-xlarge`])

  if (!responsiveImg) return

  var classes = className('u-flex', {
    'u-flexJustifyCenter': true,
    'u-flexAlignItemsCenter': layout === layouts.CENTERED_IMG_LEFT || layout === layouts.CENTERED_IMG_RIGHT
  })
  return html`
    <div class="Grid-cell u-lg-size1of2 u-sm-marginT u-md-marginT">
      <div class="${classes}" style="height: 100%; width: 100%">
        <div style="max-width: ${imgScale || '100%'}; max-height: 100%">
          <img width="100%"
               title="${img.copyright}"
                 alt="${alt}"
              srcset="${responsiveImg.srcset}"
               sizes="${responsiveImg.sizes}"
                 src="${responsiveImg.src}">
               ${imgCaption ? html`<p class="Text-small">${imgCaption}</p>` : ''}
        </div>
      </div>
    </div>
  `
}

function textColumn (bodyText, layout, bodyTextHeading) {
  var classes = className('u-flex', {
    'u-flexAlignItemsCenter': layout === layouts.CENTERED_IMG_LEFT || layout === layouts.CENTERED_IMG_RIGHT
  })

  return html`
    <div class="Grid-cell u-lg-size1of2">
      <div class="${classes}">
        <div class="Text Text--spaced">
          ${bodyText ? asElement(bodyText, linkResolver, serializer(bodyTextHeading)) : ''}
        </div>
      </div>
    </div>
  `
}
