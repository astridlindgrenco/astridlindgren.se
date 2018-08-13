var component = require('fun-component')
var cardImage = require('../image')
var { tryParseJSON, vw, debounce } = require('../../base/utils')

module.exports = function cardImageContainer (initialState, element) {
  var images = tryParseJSON(element.dataset.images)
  var ratio = element.dataset.currentImageRatio
  /** Swap square image to landscape on smaller screens */
  if (images.valid && ratio === 'square') {
    window.addEventListener('resize', debounce(() => (vw() < 960) ? swapImg() : null, 200))
    if (vw() < 960) swapImg()
  }

  function swapImg () {
    var newImage = component('image', (ctx, ...rest) => cardImage(...rest))
    newImage.on('load', function (ctx, el, name) {
      element = el
    })
    onImageLoad(images.result.square.url, function onImgLoaded () {
      element.parentNode.replaceChild(newImage(images.result, false), element)
    })
  }
}

/** Fires event on image load */
function onImageLoad (src, fn) {
  var img = document.createElement('img')
  img.src = src
  img.addEventListener('load', fn)
}
