'use strict'

const html = require('nanohtml')
const raw = require('nanohtml/raw')
const { getLocales } = require('../../locale')

module.exports = (state, list, options) => {
  const locales = getLocales()

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
  `
}
