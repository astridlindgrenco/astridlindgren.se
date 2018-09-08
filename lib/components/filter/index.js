var html = require('nanohtml')
var { className } = require('../base/utils')

module.exports = Filter
function Filter ({ action, activeFilter, filters, isDisabled }) {
  if (!filters) return null
  var classes = className('Filter', {
    'Filter--disabled': isDisabled
  })
  return html`
    <div class="${classes}">
      <form class="Filter-form" action="${action || ''}">
        <div class="Grid Grid--withGutter">
          ${filters.map(filter => select(filter, activeFilter))}
        </div>
        <button type="submit">Filtrera</button>
      </form>
    </div>
  `
}

function select (filter, activeFilter) {
  var activeFromURL = activeFilter[filter.name]
  var activeFilterOption = activeFromURL && activeFromURL.length ? activeFromURL : filter.defaultOption
  if (filter.resetLabel) {
    filter.options = [{
      label: filter.resetLabel,
      value: null
    }, ...filter.options]
  }
  var options = filter.options.map(function selectActive (option) {
    if (option.label === activeFilterOption || option.value === activeFilterOption) {
      option.isActive = true
      return option
    } else return option
  })
  var selectId = `filter-${filter.name}`
  return html`
    <div class="Filter-control">
      ${filter.label ? html`<label class="Filter-label" for="${selectId}">${filter.label}</label>` : ''}
      <select class="Filter-select" name="${filter.name}" id="${selectId}">
        ${options.map(option => html`<option${(option.isActive ? ' selected' : '')} value="${option.value}">${option.label}</option>`)}
      </select>
    </div>
  `
}
