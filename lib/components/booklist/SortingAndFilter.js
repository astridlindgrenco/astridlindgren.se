const html = require('nanohtml')
const { __ } = require('../../locale')

/**
 * Generate html for sorting, filter and view options, for the booklist.
 */

module.exports = function SortingAndFilter () {
  return html`
  <form>
    <div class="Booklist-sortAndFilter">
      <label>${__('sort by')}:</label>
      <select name="sort_by" id="sortBy" onchange="this.form.submit()">
        <option id="sortByAuthorYear" value="author_year">${__('by author year')}
        <option id="sortByTitle" value="book_title">${__('by book title')}
      </select>
      <select name="order_by" id="orderBy" onchange="this.form.submit()">
        <option id="orderByAsc" value="asc">${__('ascending number')}
        <option id="orderByDesc" value="desc">${__('descending number')}
      </select>
      <label>${__('view by')}:</label>
      <div>
        <input id="viewByList" type="radio" name="view_by" value="list" onchange="this.form.submit()">
        <label for="viewByList">Lista</label>
      </div>
      <div>
        <input id="viewByGrid" type="radio" name="view_by" value="grid" onchange="this.form.submit()">
        <label for="viewByGrid">Matris</label>
      </div>
    </div>
  </form>
  <script>
    const params = (new URL(document.location.href)).searchParams;
    const sortBy = params.get("sort_by");
    const orderBy = params.get("order_by");
    const viewBy = params.get("view_by");
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
    if (viewBy === 'grid') {
      document.getElementById('viewByGrid').checked = 'checked';
    } else {
      document.getElementById('viewByList').checked = 'checked';
    }
  </script>
`
}
