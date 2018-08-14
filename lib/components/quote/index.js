var serializer = require('../text/serializer')
var linkResolver = require('../../resolve')
var html = require('nanohtml')
var asElement = require('prismic-element')
var { __ } = require('../../locale')

module.exports = quote
function quote (body, cite) {
  // TODO add functionality for language specific quotation marks - get from language files
  const lq = __('left-quote') || '&rdquo;'
  const rq = __('right-quote') || '&rdquo;'
  if (lq && rq) body = addQuoteMarks(body, lq, rq)
  return html`
    <div class="Quote">
      <div class="Quote-body">
      ${asElement(body, linkResolver, serializer())}
      </div>
      <div class="Quote-cite">${cite}</div>
    </div>
  `
}

/**
 * Prepends and appends quote characters to Prismic StructuredText object
 * @param {Object} body A Prismic StructuredText object
 * @param {String} lq   Quote char to prepend
 * @param {String} rq   Quote char to append
 */
function addQuoteMarks (body, lq, rq) {
  var newBody = body /** Copy to prevent mutation */
  var bodyLength = newBody.length
  if (bodyLength > 1) {
    newBody = newBody.map(function addChars (element, index) {
      if (index === 0) element.text = `${lq}${element.text}`
      if ((index + 1) === bodyLength) element.text = `${element.text}${rq}`
      return element
    })
  } else {
    newBody[0].text = `${lq}${newBody[0].text}${rq}`
  }
  return newBody
}
