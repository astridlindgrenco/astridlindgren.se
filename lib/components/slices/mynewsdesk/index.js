'use strict'

const html = require('nanohtml')
const MyNewsdesk = require('../../mynewsdesk')

module.exports = mynewsdesk

/**
 * Mynewsdesk slice.
 * Basically renders an iframe-code.
 */
function mynewsdesk (slice, state, container) {
  console.log(slice.primary.widget_code)
  if ((slice.primary.widget_code || '').match(/^<iframe/)) {
    return container([MyNewsdesk(slice.primary.widget_code)])
  }
  return html`<p>Failed to render MyNewsdesk slice.</p>`
}
