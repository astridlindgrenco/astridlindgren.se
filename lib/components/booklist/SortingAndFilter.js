const html = require('nanohtml')
const { __ } = require('../../locale')

/**
 * Generate html for sorting, filter and view options, for the booklist.
 */

module.exports = function SortingAndFilter (defaultView) {
  return html`
  <form>
    <div class="Booklist-sortAndFilter">
      <div class="Booklist-toggleGroup">
        <label>${__('sort by')}:</label>
        <div class="Booklist-toggle">
          <input id="sortByAuthorYear" type="radio" name="sort_by" value="author_year" onchange="this.form.submit()">
          <label for="sortByAuthorYear">${__('by author year')}</label>
          <input id="sortByTitle" type="radio" name="sort_by" value="book_title" onchange="this.form.submit()">
          <label for="sortByTitle">${__('by book title')}</label>
        </div>
        <div class="Booklist-toggle">
          <input id="orderByAsc" type="radio" name="order_by" value="asc" onchange="this.form.submit()">
          <label for="orderByAsc">${__('ascending number')}</label>
          <input id="orderByDesc" type="radio" name="order_by" value="desc" onchange="this.form.submit()">
          <label for="orderByDesc">${__('descending number')}</label>
        </div>
      </div>
      <div class="Booklist-toggleGroup">
        <label>${__('view by')}:</label>
        <div class="Booklist-toggle">
          <input id="viewByList" type="radio" name="view_by" value="list" onchange="this.form.submit()">
          <label for="viewByList">Lista</label>
          <input id="viewByGrid" type="radio" name="view_by" value="grid" onchange="this.form.submit()">
          <label for="viewByGrid">Matris</label>
        </div>
      </div>
    </div>
  </form>
  <script>
    const params = (new URL(document.location.href)).searchParams;
    const sortBy = params.get("sort_by");
    const orderBy = params.get("order_by");
    const viewBy = params.get("view_by");
    if (orderBy === 'desc') {
      document.getElementById('orderByDesc').checked = 'checked';
    } else {
      document.getElementById('orderByAsc').checked = 'checked';
    }
    if (sortBy === 'book_title') {
      document.getElementById('sortByTitle').checked = 'checked';
    } else {
      document.getElementById('sortByAuthorYear').checked = 'checked';
    }
    if (viewBy === 'grid' || (!viewBy && '${defaultView}' ==='Rutnät')) {
      document.getElementById('viewByGrid').checked = 'checked';
    } else {
      document.getElementById('viewByList').checked = 'checked';
    }
  </script>
`
}
