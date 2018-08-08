var html = require('nanohtml')

module.exports = searchbox
// TODO replace placeholder with language specific text
function searchbox (placeholder) {
  return html`
    <div class="SearchBox">
      <input class="SearchBox-input addsearch searchbox" type="text" placeholder="${placeholder}" disabled="disabed" data-addsearch-field="true" autocomplete="off" />
    </div>
  `
}
//
