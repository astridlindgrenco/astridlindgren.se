var html = require('nanohtml')
var { asText } = require('prismic-richtext')
var { className, pipe } = require('../base/utils')

module.exports = Filter
function Filter ({
    formAction,
    requestQuery,
    filters,
    documents,
    isDisabled
  }) {
  if (!filters) return null
  var classes = className('Filter', {
    'Filter--disabled': isDisabled
  })
  //
  // Sort: Alfabetiskt/Kronologiskt
  // Ordning: Asc/Desc
  // Vy: Grid/List
  // <img id="set-grid" class="Sorting-action" src="/icons/sort-grid.svg"/>'
  var controls = buildFilterControls(filters, documents)
  return html`
    <div class="${classes}">
      <form class="Filter-form" action="${formAction || ''}">
        <div class="Grid Grid--withGutter">
          ${controls.map(control => select(control, requestQuery))}
        </div>
        <button type="submit">Filtrera</button>
      </form>
    </div>
  `
}

function select (control, requestQuery) {
  var hasNoOptions = !control.options.length
  if (control.resetLabel) {
    // If an reset (null) option is defined, prepend it to the list of choices
    control.options = [{
      label: control.resetLabel,
      value: null
    }, ...control.options]
  }
  var activeFromURL = requestQuery[control.name]
  var activeOption = ''
  if (activeFromURL && activeFromURL.length) {
    // If the filter option is present in URL params and has content
    activeOption = activeFromURL
  } else if (hasDefinedProp(control.name, requestQuery)) {
    // If is present in URL params but has no value, we assume the filter has been used to reset it
    activeOption = control.resetLabel || control.defaultOption
  } else {
    // It is not present at all in the URL params we assume the filter is unnused
    activeOption = control.defaultOption
  }
  var options = control.options.map(function selectActive (option) {
    if (option.label === activeOption || option.value === activeOption) {
      option.isActive = true
      return option
    } else return option
  })
  var selectId = `filter-${control.name}`
  var classes = className('Filter-control', {
    'u-sizeFit': true,
    'Filter-control--disabled': hasNoOptions
  })
  return html`
    <div class="${classes}">
      ${control.label ? html`<label class="Filter-label" for="${selectId}">${control.label}</label>` : ''}
      <select class="Filter-select" name="${control.name}" id="${selectId}">
        ${options.map(option => html`<option${(option.isActive ? ' selected' : '')} value="${option.value}">${option.label}</option>`)}
      </select>
    </div>
  `
}

/**
 * Creates option control objects for filter view
 * @param  {Array} options Possible filter options retrieved from list view document
 * @param  {Array} documents Prismic documents
 * @return {Array}         Controls for filter view
 */
function buildFilterControls (options, documents) {
  // Prepare an array of empty objects with api ID as key
  return options.map(function createControl ({
      label,
      api_id,
      default_option,
      reset_label
    }) {
    return {
      label,
      name: api_id,
      options: getOptions(documents, api_id), // Get the prop from all the books
      defaultOption: default_option,
      resetLabel: reset_label
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
         .map(function pairsToObj ([label, value]) {
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
