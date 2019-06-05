var { inBrowser, $ } = require('../components/base/utils')

module.exports = start
function start () {
  var appState = window.initialState
  window.initialState = null

  if (inBrowser) {
    setupPolyfills(appState)
    setupFeatureDetection(appState)
    setupContainers(appState)
  }

  /**
   * Hook up development tools
   */

  if (process.env.NODE_ENV === 'development') {

  }

  return {}
}

/** Containers/nanocomponents */
function setupContainers (appState) {
  var containerElements = $('[data-container]')
  var containers = {
    header: require('../components/header/container'),
    section: require('../components/section/container'),
    filter: require('../components/filter/container'),
    charactermenu: require('../components/charactermenu/container')
  }
  containerElements.forEach(function initContainer (element) {
    var name = element.dataset.container
    if (containers[name]) containers[name](appState, element)
  })
}

/** Polyfills */
function setupPolyfills (appState) {
  /**
   * Polyfill for HTML5 details element
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
   */
  if (document.getElementsByTagName('details').length) require('details-polyfill')
  /** CSS object-fit property, relies on postcss-object-fit */
  if (document.images.length) require('object-fit-images')()
}

/** Feature detection and dark arts */
function setupFeatureDetection () {
  /**
   * We need to fix certain flexbugs in iOS 10 Safari...
   */
  var isIOS = (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream)
  var hasHistoryRestorationSupport = !!history.scrollRestoration
  if (isIOS && !hasHistoryRestorationSupport) document.documentElement.classList.add('is-ios10')
}

if (inBrowser) document.addEventListener('DOMContentLoaded', start)
