/* global window */

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
exports.toCamelCase = function toCamelCase (str, separator = '-') {
  let words = str.split(separator)
  return `${words[0]}${words.slice(1, words.length).map(word => replaceFirstLetter(word, uppercase)).join('')}`
}

/**
 * Checks if a string is JSON
 * @param  {string}  item A string or other object to check if it's JSON
 * @return {object}      And object with the parsed result and a valid property with a boolean if it's valid
 */
exports.tryParseJSON = function tryParseJSON (item) {
  if (typeof item !== 'string') {
    return {
      valid: false,
      result: item
    }
  } else {
    try {
      item = JSON.parse(item)
    } catch (e) {
      return {
        valid: false,
        result: item
      }
    }

    if (typeof item === 'object' && item !== null) {
      return {
        valid: true,
        result: item
      }
    } else {
      return {
        valid: false,
        result: item
      }
    }
  }
}

/**
 * Makes a function call only every time ms
 * @param  {Function} fn   Funtion to call
 * @param  {Number}   time Max time in ms that the fn can be called
 * @return {Function}        A function that is debounced
 */
exports.debounce = function debounce (fn, time) {
  var timeout

  return function callback (...args) {
    var functionCall = () => fn.apply(this, ...args)
    clearTimeout(timeout)
    timeout = setTimeout(functionCall, time)
  }
}

// Sizes specification [<name>, <breakpoint>, [<size>, <size@2x>]]
const SIZES = [
  ['small', 0, [396, 792]],
  ['medium', 768, [617, 1234]],
  ['large', 1024, [1280, 2560]]
]

const CDN_URL = `https://ik.imagekit.io/${process.env.IMAGEKIT_ID}/`
const SOURCE_URL = 'https://astridlindgren.cdn.prismic.io/astridlindgren/'

/**
 * Construct image sizes compatible with application breakpoints
 * @param {object} props Prismic image formatted object
 * @param {array} use List of sizes to use
 * @return {object}
 */

exports.image = function image (props, use = ['small']) {
  const uri = props.url.split(SOURCE_URL)[1]
  const src = `${CDN_URL}tr:w-1280,q-75,pr-true/${uri}`
  const width = props.dimensions.width
  const height = props.dimensions.height
  const breakpoints = SIZES.filter(([name]) => use.includes(name))

  // Join sizes like: `[(min-width: <breakpoint>) ]<size>px`
  const sizes = breakpoints.reduce((sizes, [name, width, [size]]) => {
    return sizes.concat(`${width ? `(min-width: ${width}px) ` : ''}${size}px`)
  }, []).reverse().join(',')

  // Join sizes like: `<url> <size>w`
  const srcset = breakpoints.reduce((set, [name, width, sizes]) => {
    return set.concat(sizes.map((size, index) => {
      return `${CDN_URL}tr:w-${size},q-75,pr-true/${uri} ${size}w`
    }))
  }, []).join(',')

  return { width, height, src, srcset, sizes, alt: props.alt || '' }
}

/*
let img
  if (doc && doc.data.image.url) {
    img = image(doc.data.image, ['small', 'medium', 'large'])
  } else if (parent && parent.data.image.url) {
    img = image(parent.data.image, ['small', 'medium', 'large'])
  }

img
  ? html`
    <div class="View-section View-section--fullOnSmall" id="${this._name}-img">
      <figure class="Single-banner">
        <img class="Single-bannerFigure" alt="${img.alt}" width="${img.width}" height="${img.height}" srcset="${img.srcset}" sizes="${img.sizes}" src="${img.src}">
      </figure>
    </div>
  `
  : null

 */