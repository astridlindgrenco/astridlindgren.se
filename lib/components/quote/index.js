var serializer = require('../text/serializer')
var linkResolver = require('../../resolve')
var html = require('nanohtml')
var asElement = require('prismic-element')
var { __ } = require('../../locale')

module.exports = quote
function quote (body, cite) {
  const quotedBody = addQuoteMarks(body)
  return html`
    <div class="Quote">
      <div class="Quote-body">
      ${asElement(quotedBody, linkResolver, serializer())}
      </div>
      <div class="Quote-cite">${cite}</div>
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
