'use strict'

const html = require('nanohtml')
const raw = require('nanohtml/raw')
const { getLocales } = require('../../locale')

module.exports = (state, list) => {
  const locales = getLocales()
  const options = state.sorting_options

  return html`
    <div class="Sorting">
      <form>
        <div class="Sorting-block--left">
          <select>
            <option selected hidden>${(locales.show_all).toUpperCase()}</option>
            ${raw(list)}
          </select>

          <div class="Sorting-actions">
            ${raw(options.sorting === 'desc' ? '<img id="set-asc" class="Sorting-action" src="/icons/sort-asc.svg"/>' : '')}
            ${raw(options.sorting === 'asc' ? '<img id="set-desc" class="Sorting-action" src="/icons/sort-desc.svg"/>' : '')}
            ${raw(options.view === 'grid' ? '<img id="set-list" class="Sorting-action" src="/icons/sort-list.svg"/>' : '')}
            ${raw(options.view === 'list' ? '<img id="set-grid" class="Sorting-action" src="/icons/sort-grid.svg"/>' : '')}
          </div>
        </div>

        <div class="Sorting-block--right">
          <input id="quote-search" type="search" placeholder="${locales.search}"/>
        </div>
      </form>
    </div>

    <script>
      'use strict';

      var uri       = (new URL(document.location.href))
      var sortBy    = uri.searchParams.get("sort_by");
      var filterBy  = uri.searchParams.get("filter_by");
      var searchBy  = uri.searchParams.get("search_by");
      var orderBy   = uri.searchParams.get("order_by");
      var viewBy    = uri.searchParams.get("view_by");

      var post = () => {
        document.location.href = uri
      }

      var setAsc = document.getElementById("set-asc");
      if (setAsc) setAsc.onclick = () => { uri.searchParams.set('sort_by', 'asc'); post(); }
      var setDesc = document.getElementById("set-desc");
      if (setDesc) setDesc.onclick = () => { uri.searchParams.set('sort_by', 'desc'); post(); }

      //document.getElementById("set-list").onclick = () => { uri.searchParams.set('view_by', 'list'); post(); }
      //document.getElementById("set-grid").onclick = () => { uri.searchParams.set('view_by', 'grid'); post(); }
    </script>
  `
}
