var component = require('fun-component')
var header = require('../components/header')
var cardImage = require('../components/card/image')
var { inBrowser, $, tryParseJSON, vw, debounce } = require('../components/base/utils')

module.exports = start
function start () {

  console.log('starting client app')
  var appState = window.initialState
  window.initialState = null
  if (inBrowser) {
    var containers = $('[data-container]')
    containers.forEach(function initContainer (element) {
      var name = element.dataset.container
      switch (name) {
        case 'cardImage':
          var images = element.dataset.images
          var ratio = element.dataset.currentImageRatio
          /** Swap square image to landscape on smaller screens */
          if (images && ratio === 'square') {
            function swapImg () {
              var imageObj = tryParseJSON(images)
              if (imageObj.valid) {
                var newImage = component('image', (ctx, ...rest) => cardImage(...rest))
                newImage.on('load', function (ctx, el, name) {
                  element = el
                })
                element.parentNode.replaceChild(newImage(imageObj.result, false), element)
              }
            }
            window.addEventListener('resize', debounce(() => (vw() < 960) ? swapImg() : null, 200))
            if (vw() < 960) swapImg()
          }
          break
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
          element.parentNode.replaceChild(header(appState.navDocument, headerState), element)

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
