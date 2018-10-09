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

exports.VIEWPORTS = {
  xs: [375, 479],
  sm: [480, 767],
  md: [768, 1023],
  lg: [1024, 1249],
  xl: [1250, 1438],
  xxl: [1439],
  smViewport: [0, 480],
  mdViewport: [481, 1023],
  lgViewport: [1024]
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

/*
 * fw = up to full width image
 * hw - up to half width image
 * tw - up to thirds width image
 * qw - up to quarter width image
 * pw - up to fifth width image
 * small - for displays up to 480px width covers devices 360, 375 (24%)
 * medium - for displays up to 1024px width covers 640, 667, 768, 900, 1024 (26%)
 * large - for displays up to 1250 width covers 900, 1024, 1080, 1366 (30%)
 * xlarge - for displays over 1440px width covers 1440, 1920 (20%)
 *
 * @see http://gs.statcounter.com/screen-resolution-stats/all/sweden
 *
 */

// Sizes specification [<name>, <breakpoint>, [<size>, <size@2x>], [<quality>, <quality@2x>]]
const SIZES = [
  ['fw-small', 0, [480, 960], [80, 40]],
  ['hw-small', 0, [220, 440], [80, 40]],
  ['tw-small', 0, [140, 280], [80, 40]],
  ['qw-small', 0, [100, 200], [80, 40]],
  ['pw-small', 0, [76, 152], [80, 40]],
  ['fw-medium', 480, [1024, 2048], [80, 40]],
  ['hw-medium', 480, [492, 984], [80, 40]],
  ['tw-medium', 480, [321, 643], [80, 40]],
  ['qw-medium', 480, [236, 472], [80, 40]],
  ['pw-medium', 480, [185, 370], [80, 40]],
  ['fw-large', 1024, [1250, 2500], [80, 40]],
  ['hw-large', 1024, [605, 1210], [80, 40]],
  ['tw-large', 1024, [397, 793], [80, 40]],
  ['qw-large', 1024, [293, 585], [80, 40]],
  ['pw-large', 1024, [230, 460], [80, 40]],
  ['fw-xlarge', 1250, [1440, 2880], [80, 40]],
  ['hw-xlarge', 1250, [700, 1040], [80, 40]],
  ['qw-xlarge', 1250, [460, 920], [80, 40]],
  ['qw-xlarge', 1250, [340, 680], [80, 40]],
  ['pw-xlarge', 1250, [268, 536], [80, 40]]
]

const CDN_URL = `https://ik.imagekit.io/${process.env.IMAGEKIT_ID}/`
const SOURCE_URL = 'https://astridlindgren.cdn.prismic.io/astridlindgren/'

/**
 * Construct image sizes compatible with application breakpoints
 * Example:
 * const img = image(doc.data.image, ['fw-small', 'fw-medium', 'fw-large', 'fw-xlarge'])
 * img
 *  ? html`
 *    <img class="Single-bannerFigure" alt="${img.alt}" width="${img.width}" height="${img.height}" srcset="${img.srcset}" sizes="${img.sizes}" src="${img.src}">`
 *  : null
 *
 * @param {object} props Prismic image formatted object
 * @param {array} use List of sizes to use
 * @return {object}
 */

 // TODO:
 // Add support for 3x devices (later iPhones)
 // Add different quality settings (q-??): 80 is default, 40 is good for 2x, 30 for 3x
 // Skip scaling up images with lower source width than target width size
 // http://pieroxy.net/blog/2016/05/01/jpeg_compression_is_80_the_magic_quality_part_1_the_retina_screens.html
exports.image = function image (props, use = ['fw-small'], tr = '') {
  if (!props || !props.url) return null

  const uri = props.url.split(SOURCE_URL)[1]
  const width = props.dimensions.width
  const height = props.dimensions.height
  const src = `${CDN_URL}tr:w-${width & width < 1440 ? width : 1440},pr-true,q-80/${uri}`
  const breakpoints = SIZES.filter(([name]) => use.includes(name))

  // Join sizes like: `[(min-width: <breakpoint>) ]<size>px`
  const sizes = breakpoints.reduce((sizes, [name, width, [size], [quality]]) => {
    return sizes.concat(`${width ? `(min-width: ${width}px) ` : ''}${size}px`)
  }, []).reverse().join(',')

  // Join sizes like: `<url> <size>w`
  const srcset = breakpoints.reduce((set, [name, width, sizes, quality]) => {
    return set.concat(sizes.map((size, index) => {
      return `${CDN_URL}tr:w-${size},q-${quality[index]},pr-true${tr ? `,${tr}` : ''}/${uri} ${size}w`
    }))
  }, []).join(',')

  return { width, height, src, srcset, sizes, alt: props.alt || '' }
}

exports.dividerImage = function dividerImage (url) {
  const uri = url.split(SOURCE_URL)[1]
  return {
    srcset: `${CDN_URL}tr:h-80,w-80,c-at_max,dpr-4.0/${uri} 320w,
             ${CDN_URL}tr:h-80,w-80,c-at_max,dpr-2.5/${uri} 200w,
             ${CDN_URL}tr:h-80,w-80,c-at_max,dpr-1.6/${uri} 128w,
             ${CDN_URL}tr:h-80,w-80,c-at_max,dpr-1.0/${uri} 80w,
             ${CDN_URL}tr:h-60,w-60,c-at_max,dpr-4.0/${uri} 240w,
             ${CDN_URL}tr:h-60,w-60,c-at_max,dpr-2.5/${uri} 150w,
             ${CDN_URL}tr:h-60,w-60,c-at_max,dpr-1.6/${uri} 96w,
             ${CDN_URL}tr:h-60,w-60,c-at_max,dpr-1.0/${uri} 60w`,
    sizes: '(min-width: 480px) 80px, 60px',
    src: `${CDN_URL}tr:h-80,w-80,c-at_max,dpr-1.0/${uri}`
  }
}

/**
* Takes N number of functions and executes them left to right on a value
* @param  {Function} fs Any number of functions passed as arguments to the function
* @return {Function}    A single function that excecutes the provided functions left to right, passing return values
*/
exports.pipe = function piper (...fs) {
  return (...args) => fs.reduce((args, f) => [f.apply(this, args)], args)[0]
}

/**
 * Takes an array and returns a new chunked array
 * @param  {Array} array An array of items
 * @param  {Number} chunk Size of the chunks
 * @return {Array}       An array of arrays
 */
exports.chunkArray = function chunkArray (array, chunk) {
  if (!chunk) return array
  var chunked = []
  for (let i = 0, j = array.length; i < j; i += chunk) {
    chunked.push(array.slice(i, i + chunk))
  }
  return chunked
}
