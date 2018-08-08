var header = require('../components/header')
var { inBrowser, $ } = require('../components/base/utils')

module.exports = start
function start () {

  console.log('starting client app')
  var appState = window.initialState
  window.initialState = null
  if (inBrowser) {
    var containers = $('[data-container]')
    containers.forEach(function initContainer (container) {
      var name = container.dataset.container
      switch (name) {
        case 'header':
          let initialHeaderState = appState.ui.header
          // Use local state for now
          let headerState = {
            nav: {
              toggle () {
                headerState.nav.isToggled = true
                update()
              },
              isToggled: initialHeaderState.nav.isToggled
            },
            search: {
              toggle () {
                headerState.search.isToggled = !headerState.search.isToggled
                headerState.lang.isToggled = false
                update()
              },
              isToggled: initialHeaderState.search.isToggled
            },
            lang: {
              toggle () {
                headerState.lang.isToggled = !headerState.lang.isToggled
                headerState.search.isToggled = false
                update()
              },
              isToggled: initialHeaderState.lang.isToggled
            }
          }
          container.parentNode.replaceChild(header(appState.navDocument, headerState), container)

          function update () {
            header(appState.navDocument, headerState)
          }
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
