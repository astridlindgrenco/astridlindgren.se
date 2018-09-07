var html = require('nanohtml')
var linkResolver = require('../../../resolve')
var serializer = require('../../text/serializer')
var Section = require('../../section')
var asElement = require('prismic-element')

module.exports = questionsAndAnswers

/**
 * Q & A slice.
 */
function questionsAndAnswers (slice, state, container) {
  console.log(slice)
  return Section({
    isExpandable: false,
    push: true,
    isNarrow: true,
    body: html`
      ${slice.primary.qa_title > '' ? asElement(slice.primary.qa_title, linkResolver, serializer()) : null}
      ${slice.items.map(item => {
        return html`
          <p>${item.question}</p>
          <p>${asElement(item.answer, linkResolver, serializer())}</p>
        `
      })}
    `
  })
}
