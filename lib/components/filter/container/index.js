
module.exports = function filter (appState, element) {
  var selects = element.querySelectorAll('select')
  var selectChangedClass = 'Filter-select--hasChanged'
  var changedCount = 0
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
  var submitDisabledClass = 'Filter-submit--disabled'
  function onFilterChange () {
    if (changedCount) {
      enableButton(submit)
    } else {
      disableButton(submit)
    }
  }
  disableButton(submit)

  function disableButton (button) {
    submit.setAttribute('disabed', 'disabled')
    submit.classList.add(submitDisabledClass)
  }
  function enableButton (button) {
    submit.removeAttribute('disabed')
    submit.classList.remove(submitDisabledClass)
  }
}
