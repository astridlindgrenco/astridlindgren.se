var html = require('nanohtml')
var raw = require('nanohtml/raw')
var { asText } = require('prismic-richtext')
var { __ } = require('../../locale')
var { className, pipe } = require('../base/utils')

module.exports = Filter
function Filter ({
    formAction,
    requestQuery,
    filters,
    documents,
    sorting,
    layout,
    isDisabled
  }) {
  if (!filters) return null

  var hasNoResults = documents.length === 0
  if (hasNoResults) {
    return html`
      <div class="${classes}">
        <div class="Grid Grid--withGutter">
          <div class="Grid-cell">
            <a href="/">< ${__('back')}</a>
          </div>
          <div class="Grid-cell">
            <div class="Text">
              <p>${__('found no books')}</p>
            </div>
          </div>
        </div>
      </div>
    `
  } else {
    var controls = buildFilterControls(filters, documents, requestQuery)
    var activeFilters = controls.filter(control => control.isActive)
    var hasActiveFilter = activeFilters.length


    var groups2 = [
      {
        label: __('sort by'),
        items: [
          [
            {
              label: __('by author year'),
              id: 'sortByAuthorYear',
              name: 'sort_by',
              value: 'author_year'
            },
            {
              label: __('by book title'),
              id: 'sortByTitle',
              name: 'sort_by',
              value: 'book_title'
            }
          ],
          [
            {
              label: __('ascending number'),
              id: 'orderByAsc',
              name: 'order_by',
              value: 'asc'
            },
            {
              label: __('descending number'),
              id: 'orderByDesc',
              name: 'order_by',
              value: 'desc'
            }
          ]
        ]
      },
      {
        label: __('view by'),
        items: [
          [
            {
              label: 'Lista',
              id: 'viewByList',
              name: 'view_by',
              value: 'list'
            },
            {
              label: 'Matris',
              id: 'viewByGrid',
              name: 'view_by',
              value: 'grid'
            }
          ]
        ]
      }
    ]

    return html`
      ${filterSection({
        type: 'selectsGroups',
        header: 'Filtrera',
        headerLevel: 3,
        body: hasActiveFilter
              ? activeFilterDisplay(activeFilters)
              : html`
                  <div class="Grid Grid--withGutter">
                    ${controls.map(control => select(control, requestQuery))}
                  </div>
                  <div class="Grid u-md-flexJustifyCenter u-lg-flexJustifyCenter">
                    <div class="u-sizeFit">
                      <button class="Filter-submit js-filterSubmit" type="submit">Filtrera</button>
                    </div>
                  </div>
                `
      }, formAction, isDisabled)}
      ${filterSection({
        type: 'toggleGroups',
        header: __('sort by'),
        headerLevel: 4,
        body: sortAndFilter([
          {
            items: [
              [
                {
                  label: __('by author year'),
                  id: 'sortByAuthorYear',
                  name: 'sort_by',
                  value: 'author_year'
                },
                {
                  label: __('by book title'),
                  id: 'sortByTitle',
                  name: 'sort_by',
                  value: 'book_title'
                }
              ],
              [
                {
                  label: __('ascending number'),
                  id: 'orderByAsc',
                  name: 'order_by',
                  value: 'asc'
                },
                {
                  label: __('descending number'),
                  id: 'orderByDesc',
                  name: 'order_by',
                  value: 'desc'
                }
              ]
            ]
          }
        ])
      }, formAction, isDisabled)}
      ${filterSection({
        type: 'toggleGroups',
        header: __('view by'),
        headerLevel: 4,
        body: sortAndFilter([
          {
            items: [
              [
                {
                  label: 'Lista',
                  id: 'viewByList',
                  name: 'view_by',
                  value: 'list'
                },
                {
                  label: 'Matris',
                  id: 'viewByGrid',
                  name: 'view_by',
                  value: 'grid'
                }
              ]
            ]
          }
        ])
      }, formAction, isDisabled)}

      <script>
        const params = (new URL(document.location.href)).searchParams;
        const sortBy = params.get("sort_by");
        const orderBy = params.get("order_by");
        const viewBy = params.get("view_by");
        if (sortBy === 'book_title' || (!sortBy && '${sorting.default}' ==='book_title')) {
          document.getElementById('sortByTitle').checked = 'checked';
        } else {
          document.getElementById('sortByAuthorYear').checked = 'checked';
        }
        if (orderBy === 'desc') {
          document.getElementById('orderByDesc').checked = 'checked';
        } else {
          document.getElementById('orderByAsc').checked = 'checked';
        }
        if (viewBy === 'grid' || (!viewBy && '${layout.default}' ==='grid')) {
          document.getElementById('viewByGrid').checked = 'checked';
        } else {
          document.getElementById('viewByList').checked = 'checked';
        }
      </script>

    `
  }
}

function activeFilterDisplay (activeFilters) {
  return html`
    <div class="Grid Grid--withGutter">
      <div class="Grid-cell">
        <button type="submit">< ${__('back')}</button>
      </div>
      <div class="Grid-cell">
        <div class="Text">
          <ul>
          ${activeFilters.map(control => {
            return html`<li>${control.label}: <b style="font-weight: 600">${control.options.filter(option => option.isSelected)[0].label}</b></li>`
          })}
          </ul>
        </div>
      </div>
    </div>
  `
}

function filterSection (filter, formAction, isDisabled) {
  var classes = className('Filter', {
    'Filter--disabled': isDisabled
  })
  var headerLevel = filter.headerLevel || 3
  return html`
    <div class="${classes}" ${raw(filter.type === 'selectsGroups' ? 'data-container="filter"' : '')}>
      <div class="Grid Grid--withGutter">
        <div class="Filter-header u-md-size1of5 u-lg-size1of5">
          <div class="Text">
            <h${raw(headerLevel)}>${raw(filter.header)}</h${raw(headerLevel)}>
          </div>
        </div>
        <form class="Filter-form u-md-size4of5 u-lg-size4of5" action="${formAction || ''}">
          ${filter.body}
        </form>
      </div>
    </div>
  `
}

function sortAndFilter (groups) {
  return html`
    <div class="Filter-sortAndFilter">
      ${groups.map(function createToggleGroup (group) {
        return html`
          <div class="Filter-toggleGroup">
            ${group.items.map(function createToggle (choices) {
              return html`
                <div class="Filter-toggle">
                  ${choices.map(function createChoice (choice) {
                    return html`
                      <input id="${choice.id}" type="radio" name="${choice.name}" value="${choice.value}" onchange="this.form.submit()">
                      <label for="${choice.id}">${choice.label}</label>
                    `
                  })}
                </div>
              `
            })}
          </div>
        `
      })}
    </div>
  `
}

function select (control, requestQuery) {
  var hasNoOptions = !control.options.length
  if (hasNoOptions) return ''
  var selectId = `filter-${control.name}`
  var classes = className('Filter-control', {
    'u-md-size1of2': true,
    'u-lg-size1of4': true,
    'Filter-control--disabled': hasNoOptions
  })
  return html`
    <div class="${classes}">
      ${control.label ? html`<label class="Filter-label" for="${selectId}">${control.label}</label>` : ''}
      <select class="Filter-select" name="${control.name}" id="${selectId}">
        ${control.options.map(option => html`<option${(option.isSelected ? ' selected' : '')} value="${option.value}">${option.label}</option>`)}
      </select>
    </div>
  `
}

/**
 * Creates option control objects for filter view
 * @param  {Array} filters Possible filter options retrieved from list view document
 * @param  {Array} documents Prismic documents
 * @return {Array}         Controls for filter view
 */
function buildFilterControls (filters, documents, requestQuery) {
  return filters.map(function createControl ({
      label,
      api_id: apiID,
      default_option: defaultOption,
      reset_label: resetLabel
    }) {
    var isActiveFilter = false
    var options = getOptions(documents, apiID) // Get the prop from all the books,
    var activeFromURL = requestQuery[apiID]
    var selectedOption = ''
    if (activeFromURL && activeFromURL.length) {
      // If the filter option is present in URL params and has content
      selectedOption = activeFromURL
      isActiveFilter = true
    } else if (hasDefinedProp(apiID, requestQuery)) {
      // If is present in URL params but has no value, we assume the filter has been used to reset it
      selectedOption = resetLabel || defaultOption
    } else {
      // It is not present at all in the URL params we assume the filter is unnused
      selectedOption = defaultOption
    }
    if (options.length) {
      // If current control has any valid filter options
      if (resetLabel) {
        // If an reset (null) option is defined, prepend it to the list of choices
        options = [{
          label: resetLabel,
          value: null
        }, ...options]
      }
      // Select active filter option if any
      options = options.map(function selectOptions (option) {
        if (option.label === selectedOption || option.value === selectedOption) {
          option.isSelected = true
        }
        return option
      })
    }
    return {
      label,
      options,
      defaultOption,
      resetLabel,
      isActive: isActiveFilter,
      name: apiID
    }
  })
}

/**
 * Creates all options needed by filter view
 * @param  {Array} docs Array of Prismic documents
 * @param  {String} apiId Field API ID
 * @return {Array}       An array of options
 */
function getOptions (docs, apiId) {
  var options = docs.map(doc => getControlOptions(doc, apiId)).filter(Boolean)
  var flatUniquePairs = pipe(flattenToPairs, uniquePairs)
  return flatUniquePairs(options)
         .map(function createOption ([label, value]) {
           return {label, value}
         })
}

/**
 * Gets all values for option based on Prismic document
 * @param  {Object} doc A Prismic document
 * @param  {String} apiID Field API ID
 * @return {Array}        Key/value pair array of [label of option]/[value for option]
 */
function getControlOptions (doc, apiID) {
  var prop = apiID === 'tags' ? doc[apiID] : doc.data[apiID]
  return getControlOption(prop)
}

/**
 * Create label/value pair property for use with a filter control
 * @param  {Mixed} prop String, array, object, etc
 * @return {Array}      An key/value pair array OR an array of key/value pair arrays
 */
function getControlOption (prop) {
  if (!prop) return
  if (typeof prop === 'string') {
    if (prop.indexOf(',') !== -1) {
      // Comma separated list, do recursive call
      return prop.split(',').map(str => getControlOption(str.trim()))
    } else {
      // Simple value, key text, select
      return [prop, prop]
    }
  } else if (prop.link_type && prop.id && !prop.isBroken) {
    // Document link
    if (prop.data && prop.data.title) {
      return [asText(prop.data.title), prop.id]
    }
  } else if (Array.isArray(prop)) {
    if (prop[0].text) {
      // Structured text
      return [asText(prop), asText(prop)]
    } else {
      // Tags or something, do recursive call
      return prop.map(getControlOption)
    }
  }
}

/**
 * Takes an array with up to 3 levels and recuces it to pairs
 * Example: [[1,2], [4,6], [[[10,11], [12,13]]]] becomes [[1,2], [4,6], [10,11], [12,13]]
 * @param  {Array} arrays An array of arrays with varying dephts
 * @return {Array}        An array with key/value pair arrays
 */
function flattenToPairs (arrays) {
  return arrays.reduce(function (acc, currValue) {
    return Array.isArray(currValue[0]) ? acc.concat(currValue) : acc.concat([currValue])
  }, [])
}

/**
 * Converts an array of pairs to only unique pairs
 * @param  {Array} pairsArray Array of key/value pair arrays
 * @return {Array}           The same array but with unique values
 */
function uniquePairs (pairsArray) {
  return Array.from(new Map(pairsArray))
}

/**
 * Checks if a property IS DEFINED on an object
 * Note: needed because ({foo: undefined})['foo'] and ({})['foo'] both yields undefined
 * @param  {String}  prop A property key to look for
 * @param  {Object}  obj  A object to check if the property is defined in
 * @return {Boolean}      True it the property is defined, false if it's not
 */
function hasDefinedProp (prop, obj) {
  return Object.keys(obj).indexOf(prop) !== -1
}
