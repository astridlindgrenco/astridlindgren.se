var html = require('nanohtml')
var serializer = require('../text/serializer')
var {linkResolver} = require('../../resolve')
var asElement = require('prismic-element')
var { __ } = require('../../locale')
var { className } = require('../base/utils')
var FontClass = require('../base/fonts')

module.exports = quote
function quote (content, cite, id, state) {
  let body = Object.create(content)
  const quotedBody = addQuoteMarks(body)
  const bodyWordCount = countWordsDirty(body.map(elm => elm.text).join(''))
  const citeWordCount = countWordsDirty(cite)
  const quoteClasses = className('Quote', {
    'Quote--long': bodyWordCount > 30,
    'Quote--superLong': bodyWordCount > 50
  })
  return html`
    <div class="${quoteClasses}" id="${(id || '').replace(/ /g, '_')}">
      <div class="Quote-body${(state && state.font) ? ' ' + FontClass(state.font) : ''}">
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
  const newBody = clone(body)
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

// https://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
function clone (obj) {
  var copy

  // Handle the 3 simple types, and null or undefined
  if (obj == null || typeof obj !== 'object') return obj

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = []
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i])
    }
    return copy
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {}
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
    }
    return copy
  }

  throw new Error("Unable to copy obj! Its type isn't supported.")
}
