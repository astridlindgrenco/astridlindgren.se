const getDefaultSorting = () => {
  return 'desc'
}
let getDefaultView = () => {
  return 'list'
}
let getDefaultFilter = () => {
  return null
}
let getDefaultSearchInput = () => {
  return null
}

const DEFAULT_OPTIONS = {
  sorting: getDefaultSorting(),
  view: getDefaultView(),

  filter: getDefaultFilter(),
  search_input: getDefaultSearchInput()
}

const parseQuery = (query) => {
  if (!query) return JSON.parse(JSON.stringify(DEFAULT_OPTIONS))

  let options = {}
  options.sorting = query.sort_by || getDefaultSorting()
  options.view = query.view_by || getDefaultView()
  options.filter = query.filter_by || getDefaultFilter()
  options.search_input = query.search_by || getDefaultSearchInput()

  options.filter = options.filter ? options.filter.split(',') : null
  return options
}

module.exports = {
  parseQuery,

  getDefaultSorting,
  getDefaultView,
  getDefaultFilter,
  getDefaultSearchInput
}
