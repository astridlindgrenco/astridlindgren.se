'use strict'

/**
 * Widget embedding for a TypeForm form.
 */

const html = require('nanohtml')
const raw = require('nanohtml/raw')
const palette = require('../base/palette')
const typeformEmbed = require('@typeform/embed')

module.exports = typeformWdiget

function typeformWidget () {
  return html`
    <div id="TypeformWidgetContainer class="TypeformWidget" ${raw(getStyles(accent))}>
          loading typeform...
    </div>
    <script src="https://embed.typeform.com/embed.js" type="text/javascript"></script>
    <script type="text/javascript">
      window.addEventListener("DOMContentLoaded", function() {
        var el = document.getElementById("TypeformWidgetContainer");

        window.typeformEmbed.makeWidget(el, "${url}", {
          hideFooter: true,
          hideHeaders: true,
          opacity: 0
        });
      });
    </script>
  `
}

function getStyles (accent) {
  if (!accent) return ''
  var bgColorHex = palette.getHexCode(accent)
  var bgStyle = bgColorHex ? `background-color: ${bgColorHex};` : ''
  var styles = bgColorHex ? `style="${bgStyle}"` : ''
  return styles
}
