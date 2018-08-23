/* global addsearch */

var component = require('fun-component')
var html = require('nanohtml')
var { inBrowser, className } = require('../base/utils')
var logo = require('../logo')
var searchbox = require('../searchbox')
var getNavigation = require('../navigation')

var header = module.exports = component(function header (ctx, navDocument, { nav, search, lang }, locales) {
  var classes = className('Header', {
    'Header--withOpenNav': nav.isToggled,
    'Header--withOpenSearch': search.isToggled,
    'Header--withOpenLang': lang.isToggled
  })
  const navigation = getNavigation(navDocument)
  return html`
    <header class="${classes}" data-container="header">
      <div class="Header-logo u-sizeFit">
        ${logo({ alt: 'Astrid Lindgren Company', isFill: true, title: locales.home })}
      </div>
      <button class="Header-action Header-action--menu" onclick=${nav.toggle}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>
      <nav class="Header-nav u-sizeFill" aria-hidden="${!nav.isToggled}">
        <ul class="Header-navList Header-navList--primary u-sizeFill">
          ${navigation.primaryHtml}
        </ul>
        <aside class="Header-aside u-sizeFit">
          <ul class="Header-navList Header-navList--secondary" aria-hidden="${Boolean(search.isToggled + lang.isToggled)}">
            ${navigation.secondaryHtml}
          </ul>
          <div class="Header-actions">
            <div class="Header-action Header-action--lang">
              <button class="Header-actionTrigger" onclick=${lang.toggle} title="${locales.language}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
                </svg>
                <span class="Header-actionLabel">Ändra språk</span>
              </button>
              <div class="Header-actionPanel" aria-hidden="${!lang.isToggled}">
                <strong>${locales.language}</strong>
                <a href="/sv" title="Svenska">SV</a>
                <a href="/en/" title="English">EN</a>
                <a href="/de/" title="Deutsch">DE</a>
              </div>
            </div>
            <div class="Header-action Header-action--search">
              <button class="Header-actionTrigger" onclick=${search.toggle} title="${locales.search}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
                <span class="Header-actionLabel">Sök</span>
              </button>
              <div class="Header-actionPanel" aria-hidden="${!search.isToggled}">
                ${searchbox(locales.searchbox)}
              </div>
            </div>
          </div>
        </aside>
      </nav>
    </header>
  `
})

function navItem ({label, href, isActive, isSecondary}) {
  var classes = className('Header-navItem',
    {
      'Header-navItem--active': isActive,
      'Header-navItem--secondary': isSecondary
    }
  )
  return html`
    <li class="${classes}"><a href="${href}" class="Header-link">${label}</a></li>
  `
}

if (inBrowser) {
  header.on('update', function update (ctx, [navState, headerState], [prevNavState, prevHeaderState]) {
    // TODO fix that prevHeaderState somwhow is the same as headerState ()
    /* return headerState.nav.isToggled !== prevHeaderState.nav.isToggled
          || headerState.lang.isToggled !== prevHeaderState.lang.isToggled
          || headerState.search.isToggled !== prevHeaderState.search.isToggled */
    return true
  })
  header.on('afterupdate', function afterupdate () {
    if (window.addsearch) {
      let results = document.getElementById('addsearch-results')
      results.parentNode.removeChild(results)
      addsearch.initialized = false
      addsearch.init()
    }
  })
}
