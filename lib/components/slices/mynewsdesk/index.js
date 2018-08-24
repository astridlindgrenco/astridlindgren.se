'use strict'

const html = require('nanohtml')
const MyNewsdesk = require('../../mynewsdesk')

module.exports = mynewsdesk

/**
 * Mynewsdesk slice.
 * Basically renders an iframe-code.
 */
function mynewsdesk (slice, state, container) {
  if ((slice.primary.widget_code || '').match(/^<iframe/)) {
    return container([MyNewsdesk(slice.primary.widget_code)])
  }
  return html`<p>Failed to render MyNewsdesk slice.</p>`
}

/*



http://www.mynewsdesk.com/services/pressroom/list/gIWMhMW5zdySaqA7eyqySw/?[type_of_media=pressrelease|news|blog_post|event|image|video|document|contact_person]&[limit=limit]&[offset=offset]&[order=published|updated|created]&[format=xml|rss|json]&[locale=en]




*/
