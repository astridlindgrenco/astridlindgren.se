/* global addsearch */
var component = require('fun-component')
var html = require('nanohtml')
var raw = require('nanohtml/raw')
var { inBrowser, className, uppercase } = require('../base/utils')
var logo = require('../logo')
var langswitcher = require('../langswitcher')
var searchbox = require('../searchbox')

var header = module.exports = component(function header (ctx, navDocument, { nav, search, lang }, locales, locale, langs) {
  var classes = className('Header', {
    'Header--withOpenNav': nav.isToggled,
    'Header--withOpenSearch': search.isToggled,
    'Header--withOpenLang': lang.isToggled
  })
  const headerNavItems = navigation(navDocument)

  return html`
    <header class="${classes}" data-container="header">
      <div class="Header-logo u-sizeFit">
        ${logo({ alt: 'Astrid Lindgren Company', isFill: true, title: locales.home, locale: locale })}
      </div>
      <button class="Header-action Header-action--menu" onclick=${nav.toggle}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>
      <nav class="Header-nav u-sizeFill" aria-hidden="${!nav.isToggled}">
        <ul class="Header-navList Header-navList--primary u-sizeFill">
          ${headerNavItems.primaryLinks}
        </ul>
        <aside class="Header-aside u-sizeFit">
          <ul class="Header-navList Header-navList--secondary" aria-hidden="${Boolean(search.isToggled + lang.isToggled)}">
            ${headerNavItems.secondaryLinks}
          </ul>
          <div class="Header-actions">
            <div class="Header-action Header-action--lang">
              <button class="Header-actionTrigger" onclick=${lang.toggle} title="${locales.language}">
                ${uppercase(locale)}
                <span class="Header-actionLabel">${!lang.isToggled ? locales.language : ''}</span>
              </button>
              <div class="Header-actionPanel" aria-hidden="${!lang.isToggled}">
              ${langswitcher({ langs: langs, title: locales.language })}
              </div>
            </div>
            <div class="Header-action Header-action--search">
              <button class="Header-actionTrigger" onclick=${search.toggle} title="${locales.search}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
                <span class="Header-actionLabel">${!search.isToggled ? locales.search : ''}</span>
              </button>
              <div class="Header-actionPanel" aria-hidden="${!search.isToggled}">
                ${searchbox(locales.search)}
              </div>
            </div>
          </div>
        </aside>
      </nav>
    </header>
  `
})

/**
 * Returns html for {primaryNav, secondaryNav}.
 * Designed only for the Document link type.
 */
function navigation (document) {
  if (!document || !document.data) return { }

  const primaryLinks = links(document.data.primary_links)
  const secondaryLinks = links(document.data.secondary_links)
  return { primaryLinks, secondaryLinks }
}

function links (links) {
  return links.map(link => linkItem(link))
}

function linkItem (link) {
  if (!link.source || !link.source.lang || link.source.isBroken) return ''
  const locale = link.source.lang.substring(0, 2)
  const href = `/${locale}/${link.source.uid}`

  return html`
    <li class="Header-navItem">
      <a class="Header-link ${link.isActive ? 'Header-link--active' : ''}" href="${href}">
        ${link.label}
      </a>
        ${link.subnavigation ? raw(link.subnavigation) : ''}
    </li>
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
