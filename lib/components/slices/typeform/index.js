'use strict'

/**
 * Including a typeform iframe as a slice on a page
 */

const html = require('nanohtml')
var Section = require('../../section')
var asElement = require('prismic-element')
var { linkResolver } = require('../../../resolve')
var serializer = require('../../text/serializer')

module.exports = typeform

function typeform (slice) {
  let data = slice.primary
  return Section({
    isNarrow: true,
    body: html`
    <div class="Section-header">
      <div class="Display-title">
        ${data.typeform_title ? asElement(data.typeform_title, linkResolver, serializer()) : ''}
      </div>
    </div>
    <div class="Section-body">
      <div class="Text">
        ${data.typeform_body ? asElement(data.typeform_body, linkResolver, serializer()) : ''}
      </div>
    </div>
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
