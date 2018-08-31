'use strict'

/**
 * Render of the page type 'page'.
 */

var html = require('nanohtml')
var raw = require('nanohtml/raw')
var { getLocales } = require('../locale')
var Section = require('../components/section')
var Header = require('../components/header')
var Quote = require('../components/quote')
const ContactInfo = require('../components/contact_info')
var asElement = require('prismic-element')
var linkResolver = require('../resolve')
var serializer = require('../components/text/serializer')
const Footer = require('../components/footer')

module.exports = function page (state) {
  const doc = state.pages.items[0].data

  return html`
    <body>
      <div class="Page QuotePage">
        ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
        ${Section((() => {
          return {
            push: true,
            isNarrow: true,
            body: raw(`
              <div class="Text Text--intro">
                <h1>${doc.title[0].text}</h1>
                <p>${asElement(doc.description, linkResolver, serializer())}</p>
              </div>
            `)
          }
        })())}

        ${Section({
          isNarrow: true,
          body: html`
            <div class="QuotePage-filter">
              <select style="float: left;">
                <option selected hidden>${'Alla citat'.toUpperCase()}</option>
                ${((doc) => {
                  let output = ''
                  for (let i = 0; i < doc.body.length; i++) {
                    output += '<option value="' + doc.body[i].primary.title[0].text + '">' + doc.body[i].primary.title[0].text + '</option>'
                  }

                  return raw(output)
                })(doc)}
              </select>

              <input id="quote-search" style="float: right" type="search" placeholder="Sök bland citat"/>
            </div>
          `
        })}

        ${Section((() => {
          let output = ''

          for (let i = 0; i < doc.body.length; i++) {
            output += (() => {
              let output = `
                <div class="QuotePage-group" id="${doc.body[i].primary.title[0].text.replace(/ /g, '_').toLowerCase()}">
                  <div class="QuotePage-group-title">
                    <h2>${doc.body[i].primary.title[0].text}</h2>
                    <div>${asElement(doc.body[i].primary.content_description, linkResolver, serializer())}</div>
                  </div>
              `

              for (let n = 0; n < doc.body[i].items.length; n++) {
                let item = {}
                for (let [k, v] of state.linkedDocuments.quote_ref) {
                  if (k === doc.body[i].items[n].quote.id) item = v.data
                }

                if (item && item.quote_body) output += Quote(item.quote_body, item.quote_source, doc.body[i].items[n].quote.id)
              }
              return raw(output + '</div>')
            })()
          }
          return {
            isNarrow: true,
            body: raw(output)
          }
        })())}

        ${ContactInfo(state.linkedDocuments.contact_info_ref)}
        ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
    `
}
