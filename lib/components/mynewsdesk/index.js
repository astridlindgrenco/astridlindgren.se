var html = require('nanohtml')
var raw = require('nanohtml/raw')

module.exports = mynewsdesk
function mynewsdesk (body) {
  return html`
    <div class="MyNewsdesk-body">
      ${raw(body)}
    </div>
  `
}
