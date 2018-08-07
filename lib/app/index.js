var header = require('../components/header')
var { inBrowser, $ } = require('../components/base/utils')

module.exports = start
function start () {

  console.log('starting client app')
  var appState =  window.initialState
  window.initialState = null
  if (inBrowser) {
    var containers = $('[data-container]')
    containers.forEach(function initContainer (container) {
      var name = container.dataset.container
      switch (name) {
        case 'header':
          let nav = appState.navDocument
          let isToggled = false;
          function toggleNav () {
            isToggled = !isToggled
            header(nav, isToggled, toggleNav)
          }
          container.parentNode.replaceChild(header(nav, false, toggleNav), container)
        break;
        default:
        break;
      }
    })
  }

  /**
   * Hook up development tools
   */

  if (process.env.NODE_ENV === 'development') {

  }

  return {}
}

if (inBrowser) document.addEventListener('DOMContentLoaded', start)
