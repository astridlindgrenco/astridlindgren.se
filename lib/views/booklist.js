const html = require('nanohtml')
const { getLocales } = require('../locale')
const linkResolver = require('../resolve')
const serializer = require('../components/text/serializer')
const asElement = require('prismic-element')
const Section = require('../components/section')
const Header = require('../components/header')
const ContactInfo = require('../components/contact_info')
const Footer = require('../components/footer')
const Booklist = require('../components/booklist')
const Filter = require('../components/filter')
const Subnavigation = require('../components/subnavigation')

module.exports = function booklist (state, ctx) {
  var doc = state.pages.items.find(doc => doc.type === 'booklist')
  var filterParams = getFilterParams(state.requestQuery)
  return html`
    <body>
      <div class="Page">
      ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
      ${Section(Subnavigation(state, ctx))}
      <div class='Text Text--intro'>
        ${Section(asElement(doc.data.title, linkResolver, serializer()))}
      </div>
      ${Section({
        isNarrow: false,
        body: Filter({
          action: '',
          activeFilter: filterParams,
          filters: [
            {
              name: 'type',
              options: [
                {
                  label: 'Alla',
                  value: null
                },
                {
                  label: 'Textbok',
                  value: 'Textbok'
                },
                {
                  label: 'Bilderbok',
                  value: 'Bilderbok'
                },
                {
                  label: 'Pjäs',
                  value: 'Pjäs'
                },
                {
                  label: 'Antologi',
                  value: 'Antologi'
                },
                {
                  label: 'Samlingsvolym',
                  value: 'Samlingsvolym'
                },
                {
                  label: 'Visbok',
                  value: 'Visbok'
                },
                {
                  label: 'Biografi',
                  value: 'Biografi'
                },
                {
                  label: 'Essä',
                  value: 'Essä'
                }
              ],
              defaultOption: 'Alla'
            },
            {
              name: 'content',
              options: [
                {
                  label: 'Alla',
                  value: null
                },
                {
                  label: 'Av Astrid',
                  value: 'Av Astrid'
                },
                {
                  label: 'Om Astrid',
                  value: 'Om Astrid'
                }
              ],
              defaultOption: 'Av Astrid'
            }
          ]
        })
      })}
      ${Section(Booklist(state.books, state.viewBy))}
      ${ContactInfo(state.linkedDocuments.contact_info_ref)}
      ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
  `
}

function getFilterParams (requestQuery) {
  var whiteList = [
    'type',
    'content'
  ]
  return filterObject(whiteList, requestQuery)
}

function filterObject (whiteList, obj) {
  return Object.assign({}, ...Object.entries(obj).map(([key, value]) => whiteList.indexOf(key) !== -1 ? {[key]:value} : {}))
}
