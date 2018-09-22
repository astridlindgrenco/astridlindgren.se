var html = require('nanohtml')
var {linkResolver} = require('../../../resolve')
var serializer = require('../../text/serializer')
var Section = require('../../section')
var asElement = require('prismic-element')

module.exports = (slice, state, container) => {
  return Section({
    isExpandable: false,
    push: true,
    isNarrow: true,
    body: html`
      <div class="Section-header QandA-header">
        <div class="Display-title QandA-title">
          ${slice.primary.qa_title > '' ? asElement(slice.primary.qa_title, linkResolver, serializer()) : null}
        </div>
      </div>

      <div class="QandA-List">
        ${slice.items.map(item => {
          return html`
            <div class="QandA-Item">
              <details>
                <summary>${item.question}</summary>
                ${asElement(item.answer, linkResolver, serializer())}
              </details>
            </div>
          `
        })}
      </div>
    `
  })
}
