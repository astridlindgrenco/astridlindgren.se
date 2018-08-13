var header = require('../')

module.exports = function headerContainer (appState, element) {
  let initialHeaderState = appState.ui.header
  // Use local state for now
  let headerState = {
    nav: {
      toggle () {
        headerState.nav.isToggled = !headerState.nav.isToggled
        update()
      },
      isToggled: initialHeaderState.nav.isToggled
    },
    search: {
      toggle () {
        headerState.search.isToggled = !headerState.search.isToggled
        headerState.lang.isToggled = false
        update()
      },
      isToggled: initialHeaderState.search.isToggled
    },
    lang: {
      toggle () {
        headerState.lang.isToggled = !headerState.lang.isToggled
        headerState.search.isToggled = false
        update()
      },
      isToggled: initialHeaderState.lang.isToggled
    }
  }
  element.parentNode.replaceChild(header(appState.navDocument, headerState), element)

  function update () {
    header(appState.navDocument, headerState)
  }
}
