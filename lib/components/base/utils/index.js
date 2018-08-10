/**
 * Are we in a browser or not
 */

exports.inBrowser = (typeof window !== 'undefined') && (typeof document !== 'undefined')

/**
 * Compose class name based on supplied conditions
 * @param {string} root Base classname
 * @param {object} classes Object with key/valiue pairs of classname/condition
 * @return {string}
 */

exports.className = function className (root, classes) {
  if (typeof root === 'object') {
    classes = root
    root = ''
  }

  return Object.keys(classes).filter(key => classes[key]).reduce((str, key) => {
    return str + ' ' + key
  }, root).trim()
}

/**
 * Get viewport height
 * @return {Number}
 */

exports.vh = function vh () {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
}

/**
 * Get viewport width
 * @return {Number}
 */

exports.vw = function vw () {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
}

/**
 * Native scrollIntoView lacks an option for top offset, so let's create our own
 * @param  {element} element Element to scroll into view
 * @param  {object} opts
 * @return {undefined}
 */

exports.scrollIntoView = function scrollIntoView (element, opts = {}) {
  let offset = opts.hasOwnProperty('offsetTop') || 'header'
  if (offset === 'header') {
    offset = require('../../header').height
  } else {
    // Fix strange 1px bug
    offset = offset - 1
  }
  const targetRelativePos = element.getBoundingClientRect().top
  const currentPos = window.pageYOffset || window.scollY || 0
  const amount = currentPos + targetRelativePos - offset

  window.scroll({ top: amount, left: 0, behavior: opts.behavior || 'smooth' })
}

/**
 * Convinience for fetching DOM elements
 * @param selector {string} CSS selector to use for quering the DOM
 * @param scope {element} DOM element to use as scope. Optional. Defaults to document.
 */
exports.$ = function $ (selector, scope) {
  return [...(scope || document).querySelectorAll(selector)]
}

/**
 * Uppercases a string
 * @param  {string} str A string to uppercase
 * @return {string}     The string uppercased
 */
const uppercase = (str) => str.toUpperCase()
exports.uppercase = uppercase

/**
 * Lower cases a string
 * @param  {string} str A string to lowercased
 * @return {string}     The string lowercased
 */
const lowercase = (str) => str.toLowerCase()
exports.lowercase = lowercase

/**
 * Upper cases the first letter of a string
 * @param  {string} str Any string
 * @return {string}     The string with first letter uppercased
 */
const ucFirst = (str) => replaceFirstLetter(str, uppercase)
exports.ucFirst = ucFirst

/**
 * Replaces first character in a string using a transformer function
 * @param  {string} word     A word string
 * @param  {function} replacer A function that gets the first letter passed to it handling the transformation
 * @return {string}          A word string with the first character replaced
 */
const replaceFirstLetter = (word, transformer) => word.replace(/\w/, transformer)
exports.replaceFirstLetter = replaceFirstLetter

/**
 * Transforms separated multi word string to camelCase
 * @param  {string} str The string to transform
 * @param  {string} separator The separator to use as word boundary. Optional
 * @return {string}     The string, now camelCased
 */
exports.toCamelCase = function (str, separator = '-') {
  let words = str.split(separator)
  return `${words[0]}${words.slice(1, words.length).map(word => replaceFirstLetter(word, uppercase)).join('')}`
}
