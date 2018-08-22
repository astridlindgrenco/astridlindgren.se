var { inBrowser, $ } = require('../components/base/utils')

module.exports = start
function start () {
  var appState = window.initialState
  window.initialState = null
  if (inBrowser) {
    setupPolyfills(appState)
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
    cardImage: require('../components/card/container'),
    header: require('../components/header/container'),
    section: require('../components/section/container')
  }
  containerElements.forEach(function initContainer (element) {
    var name = element.dataset.container
    if (containers[name]) containers[name](appState, element)
  })
}

/** Polyfills */
function setupPolyfills (appState) {
  /** CSS object-fit property, relies on postcss-object-fit */
  if (document.images.length) require('object-fit-images')()
}

if (inBrowser) document.addEventListener('DOMContentLoaded', start)
