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
      <form action="${action || ''}">
        ${filters.map(filter => filterSelect(filter, activeFilter))}
        <button type="submit">Filtrera</button>
      </form>
    </div>
  `
}

function filterSelect (filter, activeFilter) {
  var activeFromURL = activeFilter[filter.name]
  console.log(activeFilter)
  var activeFilterOption = activeFromURL && activeFromURL.length ? activeFromURL : filter.defaultOption
  var options = filter.options.map(function selectActive (option) {
    console.log(option, activeFilterOption)
    if (option.label === activeFilterOption || option.value === activeFilterOption) {
      option.isActive = true
      return option
    } else return option
  })
  return html`
    <select name="${filter.name}">
      ${options.map(option => html`<option${(option.isActive ? ' selected' : '')} value="${option.value}">${option.label}</option>`)}
    </select>
  `
}
