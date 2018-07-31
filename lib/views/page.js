var html = require('nanohtml')
var header = require('../components/header')

module.exports = function page (state) {
  const uid = (state.params.sub_path || state.params.path)
  const doc = state.pages.items.find(item => item.uid === uid)
  console.log(uid, doc)
  return html`
    <div class="Page">
      ${header(uid)}
      <p>${doc.data.text}</p>
    </div>
  `
}
