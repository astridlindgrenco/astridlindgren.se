var html = require('nanohtml')

module.exports = header
function header (text) {
  return html`
    <div class="Masthead">
      <h1 style="color: red">${text}</h1>
    </div>
  `
}
