var html = require('nanohtml')
var raw = require('nanohtml/raw')
var { asText } = require('prismic-richtext')
var { __ } = require('../../locale')
var { className, pipe } = require('../base/utils')

module.exports = Filter
function Filter ({
    formAction,
    requestQuery,
    options,
    documents,
    sortBy,
    viewBy,
    orderBy,
    sortingOptions
  }) {
  if (!options || !documents || (documents && documents.length === 0)) return ''
  var controls = buildFilterControls(options, documents, requestQuery)
  var activeFilters = controls.filter(control => control.isActive)
  var hasActiveFilter = activeFilters.length
  var classes = className('Filter', {
    'Filter--activeFilter': hasActiveFilter
  })
  return html`
    <form class="${classes}" data-container="filter" data-filter-active="${hasActiveFilter}" action="${formAction || ''}">
      ${filterSection({
        type: 'selectsGroups',
        header: hasActiveFilter ? __('Filtering on') : __('Filter'),
        toggleLabels: [
          __('Show filter'),
          __('Hide filter')
        ],
        headerLevel: 3,
        body: hasActiveFilter
              ? activeFilterDisplay(activeFilters, formAction)
              : filterControls(controls)
      }, formAction)}
      ${sortingOptions ? sortingAndLayout(sortingOptions) : ''}
    </form>
  `
}

/**
 * Renders filter select element controls section
 * @param  {Array} controls     Array of selectControl view configs
 * @return {Object}             Nanohtml view
 */
function filterControls (controls) {
  return html`
    <div class="Grid Grid--withGutter">
      ${controls.map(selectControl)}
      <div class="u-md-size1of2 u-lg-size1of4">
        <button class="Filter-submit js-filterSubmit" type="submit">${__('Filter')}</button>
      </div>
    </div>
  `
}

/**
 * Renders view for when an filter is currently active
 * @param  {Array} activeFilters  Array of what filters are active (as selectControl view config objects)
 * @return {Object}             Nanohtml view
 */
function activeFilterDisplay (activeFilters, resetURL) {
  return html`
    <div class="Filter-activeDisplay">
      <div class="Grid Grid--withGutter">
        <div class="Grid-cell">
          <div class="Text">
            ${activeFilters.map(control => {
              var selectedOption = control.options.filter(option => option.isSelected)[0]
              return html`
                <input type="hidden" name="${control.name}" value="${selectedOption.value}" />
                <p class="Filter-activeFilter">${control.label}: <b>${selectedOption.label}</b></p>
                `
            })}
          </div>
        </div>
        <div class="Grid-cell">
          <a class="Filter-submit" href="${resetURL}">${__('clear filter')}</a>
        </div>
      </div>
    </div>
  `
}

/**
 * Renders a section of filters that can be toggled with a button in small screens
 * Note: As it only renders a provided body it can display any kind of filter controls not only selects
 * @param  {Object}  filter     View data for filter
 * @return {Object}             Nanohtml view
 */
function filterSection (filter) {
  var headerLevel = filter.headerLevel || 3
  var [ showLabel, hideLabel ] = filter.toggleLabels
  return html`
    <div class="Filter-section">
      <div class="Grid Grid--withGutter">
        <div class="Filter-header js-filterHeader u-md-size1of5 u-lg-size1of5">
          <div class="Text">
            <h${raw(headerLevel)}>${raw(filter.header)}</h${raw(headerLevel)}>
          </div>
          <button class="Filter-selectsToggle js-filterToggle" data-show-label="${showLabel}" data-hide-label="${hideLabel}">${showLabel}</button>
        </div>
        <div class="Filter-form u-md-size4of5 u-lg-size4of5">
          ${filter.body}
        </div>
      </div>
    </div>
  `
}

/**
 * Renders simple toggle buttons for fine tuning potentially for sort order, layout etc
 * @param  {Object}  options    View data for sorting and layout
 * @return {Object}             Nanohtml view
 */
function sortingAndLayout (options) {
  var { left, right } = options
  if (!left && !right) return null
  return html`
    <div class="Filter-sorting">
      <div class="Grid Grid--withGutter">
        ${left
          ? html`
            <div class="Filter-sortLeft u-flex u-lg-flexJustifyStart u-lg-size1of2">
              <div class="Filter-sortHeader u-sm-sizeFill u-md-size1of6 u-lg-sizeFit u-flex u-flexAlignItemsCenter">
                <p class="Text-label">${raw(left.header)}</p>
              </div>
              ${toggleGroups(left.groups)}
            </div>
          `
          : ''}
        ${right
          ? html`
            <div class="Filter-sortRight u-flex u-lg-flexJustifyEnd u-lg-size1of2">
              <div class="Filter-sortHeader u-sm-sizeFill u-md-size1of6 u-lg-sizeFit u-flex u-flexAlignItemsCenter">
                <p class="Text-label">${raw(right.header)}</p>
              </div>
              ${toggleGroups(right.groups)}
            </div>
          `
          : ''}
      </div>
    </div>
  `
}

/**
 * Creates toggle options for sorting and views with support for groups
 * @param  {Array} groups       An array with groups of toggle buttons (separated by a pipe in design)
 * @param  {Object} requestQuery The current request, used to select inputs
 * @return {Object}              Nanohtml view
 */
function toggleGroups (groups) {
  return html`
    <div class="Filter-listOptions">
      ${groups.map(function createToggleGroup (group) {
        // For every group...
        return html`
          <div class="Filter-toggleGroup">
            ${group.items.map(function createToggle (choices) {
              // Get the TWO choices the toggle button defines
              return html`
                <div class="Filter-toggle">
                  ${choices.map(function createChoice (choice, index) {
                    // Render those TWO options
                    return html`
                      <input class="Filter-toggleInput" id="toggle-${choice.name}-${index}" type="radio" name="${choice.name}" value="${choice.value}"${raw(choice.isChecked ? ' checked="checked"' : '')} onchange="this.form.submit()">
                      <label class="Filter-toggleLabel" for="toggle-${choice.name}-${index}">${choice.label}</label>
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

/**
 * Renders a select control
 * @param  {Object} control Configuration for view
 * @return {Object}         Nanohtml view
 */
function selectControl (control) {
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
    if (!prop.length) return
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
