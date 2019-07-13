var html = require('nanohtml')

module.exports = definitionlist
function definitionlist (definitions = []) {
  if (!definitions.length) return null
  return html`
    <dl class="DefinitionList">
      ${definitions.map(defintion)}
    </dl>
  `
}

function defintion ([title, data]) {
  return html`
  <div class="DefinitionList-container">
    <dt class="DefinitionList-title">${title}</dt>
    <dd class="DefinitionList-data">${data}</dd>
  </div>
  `
}
