var html = require('nanohtml')
var raw = require('nanohtml/raw')
var serializer = require('../text/serializer')
var { linkResolver } = require('../../resolve')
var asElement = require('prismic-element')
var { __ } = require('../../locale')
var { className } = require('../base/utils')
var { getCustomFontClass } = require('../base/fonts')

module.exports = quote
function quote (content, cite, id, state) {
  let body = Object.create(content)
  const bodyWordCount = countWordsDirty(body.map(elm => elm.text).join(''))
  const citeWordCount = countWordsDirty(cite)
  const lq = __('left-quote')
  const rq = __('right-quote')
  const quoteClasses = className('Quote', {
    'Quote--long': bodyWordCount > 30,
    'Quote--superLong': bodyWordCount > 50
  })
  return html`
    <div class="${quoteClasses}" id="${(id || '').replace(/ /g, '_')}">
      <div class="Quote-body${(state && state.font) ? ' ' + getCustomFontClass(state.font) : ''}">
      ${raw(lq)}${asElement(body, linkResolver, serializer())}${raw(rq)}
      </div>
      <div class="Quote-cite${citeWordCount > 15 ? ' Quote-cite--long' : ''}">${cite}</div>
    </div>
  `
}

/**
 * Count words (and yes dots and notation etc)
 * @param {String} text A basic string
 */
function countWordsDirty (text) {
  if (text) {
    return text.split(' ').length
  } else return 0
}
