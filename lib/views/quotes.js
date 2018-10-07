'use strict'

/**
 * Render of the page type 'page'.
 */

const html = require('nanohtml')
const raw = require('nanohtml/raw')
const { getLocales } = require('../locale')
const Section = require('../components/section')
const Header = require('../components/header')
const Sorting = require('../components/sorting')
const ReaganSort = require('../reagan-sort')
const Quote = require('../components/quote')
const ContactInfo = require('../components/contact_info')
const asElement = require('prismic-element')
const {linkResolver} = require('../resolve')
const serializer = require('../components/text/serializer')
const Footer = require('../components/footer')

module.exports = function page (state) {
  const doc = state.pages.items[0].data
  const sorting = state.sorting_options
  const locales = getLocales()

  let filter = `
    ${((doc) => {
      let tags = []
      for (let i = 0; i < doc.body.length; i++) {
        for (let n = 0; n < doc.body[i].items.length; n++) {
          for (let x = 0; x < doc.body[i].items[n].quote.tags.length; x++) {
            if (tags.indexOf(doc.body[i].items[n].quote.tags[x]) === -1) tags.push(doc.body[i].items[n].quote.tags[x])
          }
        }
      }

      let output = ''
      let selected = false
      for (let i = 0; i < tags.length; i++) {
        if (sorting.search_input && sorting.search_input === tags[i]) {
          selected = true

          output += '<option selected value="' + tags[i] + '">' + tags[i] + '</option>'
          continue
        }

        output += '<option value="' + tags[i] + '">' + tags[i] + '</option>'
      }

      output = ('<option value=""' + (!selected ? 'selected' : '') + '>' + (locales.show_all).toUpperCase() + '</option>') + output
      return raw(output)
    })(doc)}
  `

  let quotes = []
  for (let i = 0; i < doc.body.length; i++) {
    for (let n = 0; n < doc.body[i].items.length; n++) {
      let item = doc.body[i].items[n].quote
      let quote = {}

      for (let [k, v] of state.linkedDocuments.quote_ref) {
        if (k === item.id) quote = v.data
      }

      let body = ''
      for (let i = 0; i < quote.quote_body.length; i++) body += quote.quote_body[i].text + '\n'

      quotes.push({
        id: item.id,
        tags: item.tags.join(',') || '',
        tags_body: item.tags || [],

        group_title: doc.body[i].primary.title[0].text,
        group_description: doc.body[i].primary.content_description,

        author: quote.quote_source,
        text: body,
        body: quote.quote_body
      })
    }
  }

  let sort = new ReaganSort(quotes)

  if (sorting.filter) {
    quotes = sort.filter(sorting.filter, quotes)
  }

  if (sorting.sorting) {
    quotes = sort.sort([((sorting.sorting === 'desc' ? '' : '-') + 'text')], quotes)
  }

  if (sorting.filter && sorting.filter.includes('tags')) {
    quotes = sort.search(sorting.filter, sorting.filter, sorting.search_input, quotes)
  }

  if (sorting.search_input && (!sorting.filter || !sorting.filter.includes('tags'))) {
    quotes = sort.search(['text'], ['text'], sorting.search_input, quotes)
  }

  return html`
    <body>
      <div class="Page QuotePage">
        ${Section(Header(state.navDocument, state.ui.header, getLocales(), state.locale))}
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
          body: Sorting(state, filter)
        })}

        ${Section((() => {
          let output = ''

          for (let i = 0; i < doc.body.length; i++) {
            output += (() => {
              if (!doc || !doc.body || !doc.body[i] || !doc.body[i]) return ''
              let res = ''

              for (let n = 0; n < quotes.length; n++) {
                let quote = quotes[n]

                if (quote.group_title !== doc.body[i].primary.title[0].text) {
                  continue
                }

                if (!res) {
                  res += `
                    <div class="QuotePage-group" id="${quote.group_title.replace(/ /g, '_').toLowerCase()}">
                      <div class="QuotePage-group-title">
                        <h2>${quote.group_title}</h2>
                        <div>${asElement(quote.group_description, linkResolver, serializer())}</div>
                      </div>
                  `
                }

                res += Quote(quote.body, quote.author, quote.id)
              }

              if (res) {
                return raw(res + '</div>')
              } else return ''
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
