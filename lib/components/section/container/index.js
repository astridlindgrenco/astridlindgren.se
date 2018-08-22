var html = require('nanohtml')
var { tryParseJSON } = require('../../base/utils')

module.exports = function section (appState, element) {
  var options = tryParseJSON(element.dataset.options)
  if (!options.valid) return
  options = options.result
  if (options.isExpandable) makeExpandable(element, options)
}

function makeExpandable (element, options) {
  var isExpanded = element.dataset.collapsed === 'false'
  var toggleButton = html`
    <button class="Section-toggle">
      ${isExpanded ? 'Dölj' : 'Visa'}
    </button>
  `
  var toggle = Toggler(isExpanded, element)
  setTimeout(() => element.classList.add('Section--isExpandableReady'), 250)
  toggleButton.addEventListener('click', function onToggle (event) {
    toggle()
    event.preventDefault()
    return false
  })
  element.appendChild(toggleButton)
  if (isExpanded) {
    expand(element)
  } else {
    collapse(element)
  }
}

function Toggler (isExpanded, section) {
  function toggleSection () {
    if (isExpanded) {
      expand(section)
    } else {
      collapse(section)
    }
    isExpanded = !isExpanded
    return isExpanded
  }
  toggleSection()
  return toggleSection
}

function expand (section) {
  section.setAttribute('aria-hidden', false)
  section.classList.add('Section--isExpanded')
  section.classList.remove('Section--isCollapsed')
  return section
}
function collapse (section) {
  section.setAttribute('aria-hidden', true)
  section.classList.add('Section--isCollapsed')
  section.classList.remove('Section--isExpanded')
  return section
}
