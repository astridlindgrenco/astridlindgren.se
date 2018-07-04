var html = require('nanohtml')

module.exports = section
function section ({ body, isFill }) {
  return html`
    <div class="Section">
      <div class="Section-body">
        ${body}
      </div>
    </div>
  `
}
