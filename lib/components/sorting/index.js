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
          <select id="set-filter">
            ${raw(list)}
          </select>

          <div class="Sorting-actions">
            ${raw(!options.hide_sort && options.sorting === 'desc' ? '<img id="set-asc" class="Sorting-action" src="/icons/sort-asc.svg"/>' : '')}
            ${raw(!options.hide_sort && options.sorting === 'asc' ? '<img id="set-desc" class="Sorting-action" src="/icons/sort-desc.svg"/>' : '')}
            ${raw(!options.hide_view && options.view === 'grid' ? '<img id="set-list" class="Sorting-action" src="/icons/sort-list.svg"/>' : '')}
            ${raw(!options.hide_view && options.view === 'list' ? '<img id="set-grid" class="Sorting-action" src="/icons/sort-grid.svg"/>' : '')}
          </div>
        </div>

        <div class="Sorting-block--right">
          <input id="set-search" type="search" placeholder="${locales.search}" value="${options.search_input}"/>
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
        document.location.href = uri;
        return false;
      }

      var setAsc = document.getElementById("set-asc");
      if (setAsc) setAsc.onclick = () => { uri.searchParams.set('sort_by', 'asc'); post(); }
      var setDesc = document.getElementById("set-desc");
      if (setDesc) setDesc.onclick = () => { uri.searchParams.set('sort_by', 'desc'); post(); }

      document.getElementById('set-filter').addEventListener('change', function () {
        var input = this.value;

        uri.searchParams.set('fitler_by', 'tags');
        if (input)
          uri.searchParams.set('search_by', input);
        else {
          uri.searchParams.delete('search_by');
          uri.searchParams.delete('fitler_by');
        }
        post();
      });

      document.getElementById('set-search').onkeypress = function (e) {
        if (!e) e = window.event;

        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
          var input = document.getElementById('set-search').value;

          uri.searchParams.delete('fitler_by');

          if (input)
            uri.searchParams.set('search_by', input)
          else
            uri.searchParams.delete('search_by');

          return post();
        }
      }

      var setList = document.getElementById("set-list")
      if (setList) setList.onclick = () => { uri.searchParams.set('view_by', 'list'); post(); }
      var setGrid = document.getElementById("set-grid")
      if (setGrid) setGrid.onclick = () => { uri.searchParams.set('view_by', 'grid'); post(); }
    </script>
  `
}
