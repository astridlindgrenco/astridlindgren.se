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

// Sizes specification [<name>, <breakpoint>, [<size>, <size@2x>]]
const SIZES = [
  ['small', 0, [396, 792]],
  ['medium', 768, [617, 1234]],
  ['large', 1024, [1280, 2560]]
]

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
