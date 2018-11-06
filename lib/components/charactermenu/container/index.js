
module.exports = function CharacterMenu (appState, element) {
  const title = element.querySelector('.js-titleLink')
  title.addEventListener('click', event => toggleMenu(element))
  setCustomProps(element, title)
}

function toggleMenu (menu) {
  menu.classList.toggle('open')
}

function setCustomProps (element, title, delayForCustomFontLoad = 300) {
  setTimeout(function setHeightProp () {
    if (element.style.setProperty) {
      let height = title.offsetHeight
      if (typeof height === 'number') {
        element.classList.add('CharacterMenu--dynamicHeight')
        element.style.setProperty('--CharacterMenuTitleHeight', `${title.offsetHeight}px`)
      }
    }
  }, delayForCustomFontLoad)
}
