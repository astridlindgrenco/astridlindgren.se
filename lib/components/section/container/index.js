var { tryParseJSON } = require('../../base/utils')

module.exports = function section (appState, element) {
  var options = tryParseJSON(element.dataset.options)
  if (!options.valid) return
  options = options.result
  if (options.isExpandable) makeExpandable(element, options)
}

function makeExpandable (element, options) {
  var isExpanded = element.dataset.collapsed === 'false'
  var toggleButton = element.querySelector('.js-toggle')
  var toggle = Toggler(isExpanded, element)
  setTimeout(() => element.classList.add('Section--isExpandableReady'), 350)
  toggleButton.addEventListener('click', function onToggle (event) {
    var isExpanded = toggle()
    toggleButton.classList.toggle('Section-toggle--isExpanded')
    var labelsFromData = tryParseJSON(toggleButton.dataset.labels)
    if (labelsFromData.valid) {
      var labels = {
        show: labelsFromData.result.show,
        hide: labelsFromData.result.hide
      }
      toggleButton.innerHTML = isExpanded ? labels.show : labels.hide
    }
    event.preventDefault()
  })
  if (isExpanded) {
    expand(element)
  } else {
    collapse(element)
  }
}

function Toggler (isExpanded, section, button) {
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
