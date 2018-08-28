var html = require('nanohtml')
var serializer = require('../text/serializer')
var linkResolver = require('../../resolve')
var asElement = require('prismic-element')
var { __ } = require('../../locale')
var { className } = require('../base/utils')

module.exports = quote
function quote (body, cite, id) {
  const quotedBody = addQuoteMarks(body)
  const bodyWordCount = countWordsDirty(body.map(elm => elm.text).join(''))
  const citeWordCount = countWordsDirty(cite)
  const quoteClasses = className('Quote', {
    'Quote--long': bodyWordCount > 30,
    'Quote--superLong': bodyWordCount > 50
  })
  return html`
    <div class="${quoteClasses}" id="${(id || '').replace(/ /g, '_')}">
      <div class="Quote-body">
      ${asElement(quotedBody, linkResolver, serializer())}
      </div>
      <div class="Quote-cite${citeWordCount > 15 ? ' Quote-cite--long' : ''}">${cite}</div>
    </div>
  `
}

/**
 * Prepends and appends quote characters to Prismic StructuredText object
 * @param {Object} body A Prismic StructuredText object
 */
function addQuoteMarks (body) {
  const lq = __('left-quote')
  const rq = __('right-quote')
  const newBody = Object.assign(body)
  if (newBody.length > 0 && lq && rq) {
    newBody[0].text = `${lq}${newBody[0].text}`
    newBody[newBody.length - 1].text = `${newBody[newBody.length - 1].text}${rq}`
  }
  return newBody
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
