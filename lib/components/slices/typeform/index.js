'use strict'

/**
 * Including a typeform iframe as a slice on a page
 */

const html = require('nanohtml')
var Section = require('../../section')

module.exports = typeform

function typeform (slice) {
  let data = slice.primary
  return Section({
    body: html`
      <div id="typeform-container" style="height: 600px;"></div>
      <script src="https://embed.typeform.com/embed.js" type="text/javascript"></script>
      <script type="text/javascript">
        window.addEventListener("DOMContentLoaded", function() {
          var el = document.getElementById("typeform-container");
          window.typeformEmbed.makeWidget(el, "${data.typeform_url.embed_url}", {
            hideFooter: true,
            hideHeaders: true,
            opacity: 0
          });
        });
      </script>
    `
  })
}
