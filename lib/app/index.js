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
          let headerState = {
            hasOpenNav: false,
            hasOpenSearch: false,
            hasOpenLang: false
          };
          function toggleNav () {
            headerState.hasOpenNav = !headerState.hasOpenNav
            header(nav, headerState, toggleNav, toggleSearch, toggleLang)
          }
          function toggleSearch () {
            headerState.hasOpenSearch = !headerState.hasOpenSearch
            headerState.hasOpenLang = false
            header(nav, headerState, toggleNav, toggleSearch, toggleLang)
          }
          function toggleLang () {
            headerState.hasOpenLang = !headerState.hasOpenLang
            headerState.hasOpenSearch = false
            header(nav, headerState, toggleNav, toggleSearch, toggleLang)
          }
          container.parentNode.replaceChild(header(nav, headerState, toggleNav, toggleSearch, toggleLang), container)
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
