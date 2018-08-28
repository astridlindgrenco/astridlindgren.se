var html = require('nanohtml')

module.exports = newsdesk

function newsdesk (subdomain) {
  return html`
    <div class="newsdesk-body">
      <iframe id="mnd-iframe" width="100%" frameborder="0" allowtransparency="true" scrolling="yes" src="http://${subdomain}.mynewsdesk.com/" height="2883"></iframe>
    </div>
  `
}
