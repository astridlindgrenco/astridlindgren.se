var { vw, VIEWPORTS } = require('../../base/utils')

module.exports = function filter (appState, element) {
  var selects = element.querySelectorAll('select')
  var selectChangedClass = 'Filter-select--hasChanged'
  var changedCount = 0
  var isOpen = vw() > VIEWPORTS.sm[0]

  if (!isOpen) collapseSection(element)

  var header = element.querySelector('.js-filterHeader')
  header.addEventListener('click', function toggleHeader () {
    if (isOpen) {
      collapseSection(element)
    } else {
      expandSection(element)
    }
    isOpen = !isOpen
  })

  // Handle change in selectsGroups
  selects.forEach(function addChangeEvent (select) {
    var originalIndex = select.selectedIndex
    select.addEventListener('change', function onSelectChange () {
      if (select.selectedIndex !== originalIndex) {
        select.classList.add(selectChangedClass)
        changedCount++
        onFilterChange()
      } else {
        select.classList.remove(selectChangedClass)
        changedCount--
        onFilterChange()
      }
    })
  })

  var submit = element.querySelector('.js-filterSubmit')
  disableButton(submit)

  function onFilterChange () {
    if (changedCount) {
      enableButton(submit)
    } else {
      disableButton(submit)
    }
  }

  function collapseSection (section) {
    section.classList.add('Filter--collapsed')
  }
  function expandSection (section) {
    section.classList.remove('Filter--collapsed')
  }

  function disableButton (button) {
    button.setAttribute('disabed', 'disabled')
    button.classList.add('Filter-submit--disabled')
  }
  function enableButton (button) {
    button.removeAttribute('disabed')
    button.classList.remove('Filter-submit--disabled')
  }
}
