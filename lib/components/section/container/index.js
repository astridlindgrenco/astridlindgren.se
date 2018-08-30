var { tryParseJSON } = require('../../base/utils')

module.exports = function section (appState, element) {
  var options = tryParseJSON(element.dataset.options)
  if (!options.valid) return
  options = options.result
  if (options.isExpandable) makeExpandable(element, options, appState.locales)
}

function makeExpandable (element, options, locales) {
  var isExpanded = element.dataset.collapsed === 'false'
  var toggleButton = element.querySelector('.js-toggle')
  var toggle = Toggler(isExpanded, element)
  setTimeout(() => element.classList.add('Section--isExpandableReady'), 350)
  toggleButton.addEventListener('click', function onToggle (event) {
    var isExpanded = toggle()
    toggleButton.classList.toggle('Section-toggle--isExpanded')
    toggleButton.innerHTML = isExpanded ? locales.show_more : locales.show_less
    event.preventDefault()
  })
  if (isExpanded) {
    expand(element)
  } else {
    collapse(element)
  }

  // FIXME: real solution here instead
  toggleButton.click()
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
