const html = require('nanohtml')
const Section = require('../components/section')
const Header = require('../components/header')
const ContactInfo = require('../components/contact_info')
const Footer = require('../components/footer')
const { __, getLocales } = require('../locale')
const Booklist = require('../components/booklist')
const asElement = require('prismic-element')
const linkResolver = require('../resolve')
const serializer = require('../components/text/serializer')

module.exports = function newsroom (state) {
  var doc = state.pages.items.find(doc => doc.type === 'booklist')
  return html`
    <body>
      <div class="Page">
      ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
      <div class="Text Text--intro">
        ${Section(asElement(doc.data.title, linkResolver, serializer()))}
      </div>
      ${Section(SortingAndFilter())}
      ${Section(Booklist(state.books, doc))}
      ${ContactInfo(state.linkedDocuments.contact_info_ref)}
      ${Footer(state.linkedDocuments.footer_ref)}
      </div>
    </body>
  `
}

function SortingAndFilter () {
  return html`
  <div class="Booklist-sortAndFilter">
    <form>
      <label>${__('sort by')}:</label>
      <select name="sort_by" id="sortBy" onchange="this.form.submit()">
        <option id="sortByAuthorYear" value="author_year">${__('by author year')}
        <option id="sortByTitle" value="book_title">${__('by book title')}
      </select>
      <select name="order_by" id="orderBy" onchange="this.form.submit()">
        <option id="orderByAsc" value="asc">${__('ascending number')}
        <option id="orderByDesc" value="desc">${__('descending number')}
      </select>
    </form>
  </div>
  <script>
    const params = (new URL(document.location.href)).searchParams;
    const sortBy = params.get("sort_by");
    const orderBy = params.get("order_by");
    if (orderBy === 'desc') {
      document.getElementById('orderByDesc').selected = true;
    } else {
      document.getElementById('orderByAsc').selected = true;
    }
    if (sortBy === 'book_title') {
      document.getElementById('sortByTitle').selected = true;
    } else {
      document.getElementById('sortByAuthorYear').selected = true;
    }
  </script>
`
}
