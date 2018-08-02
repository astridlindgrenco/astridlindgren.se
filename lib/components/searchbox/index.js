var html = require('nanohtml')

module.exports = searchbox
// TODO replace placeholder with language specific text
function searchbox () {
  return html`
  <input type="text" class="addsearch searchbox" disabled="disabled" placeholder="Vad söker du?" />
  <script src="https://addsearch.com/js/?key=f0abcaffa8919d471aabeb9ed0f04b61"></script>
  `
}
