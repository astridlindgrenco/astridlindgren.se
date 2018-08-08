var html = require('nanohtml')

module.exports = searchbox
// TODO replace placeholder with language specific text
function searchbox (placeholder) {
  return html`
    <div class="SearchBox">
      <input class="SearchBox-input addsearch searchbox" type="text" disabled="disabled" placeholder="${placeholder}" />
      <!-- <script src="https://addsearch.com/js/?key=f0abcaffa8919d471aabeb9ed0f04b61"></script> -->
    </div>
  `
}
