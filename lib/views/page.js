'use strict'

/**
 * Render of the page type 'page'.
 */

const html = require('nanohtml')
const asElement = require('prismic-element')
const { linkResolver, getParents, getImmediateChildren, getSiblings } = require('../resolve')
const { getLocales } = require('../locale')
const { getCustomFontClass } = require('../components/base/fonts')
const Section = require('../components/section')
const Header = require('../components/header')
const Slices = require('../components/slices')
const Hero = require('../components/hero')
const ContactInfo = require('../components/contact_info')
const Footer = require('../components/footer')
const serializer = require('../components/text/serializer')
//const Subnavigation = require('../components/subnavigation')

module.exports = function pageView (state, ctx) {
  const uid = state.uid
  const doc = state.pages.items.find(item => item.uid === uid)
  var hasCollasibleBody = doc.data.theme_collapse_main_body === 'Ja'

  const headerFont = state.font ? ' ' + getCustomFontClass(state.font) : ''
  let heading = {}
  heading[headerFont] = true

/*
${state.is_character_menu ? Section(Subnavigation(state, ctx, true)) : ''}
${Section(Subnavigation(state, ctx))}

 */

  return html`
    <body>
      <div class="Page">
        ${Section(Header(state.navDocument, state.ui.header, getLocales()))}
        <div class="${state.is_character_menu ? 'SubNav-CharacterMenu-Wrapper' : ''}" style="position:relative;">
          ${state.is_character_menu ? Section(newCharacterNavigation(state)) : ''}
          ${Section(newSubNavigation({ currentPageId: doc.id, renderThirdLevel: state.is_character_menu }))}
          ${Section(Hero(doc.data.hero_image))}
        </div>
        ${Section({
          push: false,
          isNarrow: true,
          body: html`
            <div class="Text Text--intro">
              ${asElement(doc.data.title, linkResolver, serializer({
                classes: {
                  heading1: heading
                }
              }))}
              ${asElement(doc.data.intro, linkResolver, serializer())}
            </div>
          `
        })}
        ${Section({
          isExpandable: hasCollasibleBody,
          pullTop: hasCollasibleBody,
          isNarrow: true,
          body: html`
            <div class="Text">
              ${asElement(doc.data.main_body, linkResolver, serializer({
                classes: {
                  heading2: { 'Text-h3': true }
                }
              }))}
            </div>
          `})
        }
        ${Slices(state, doc.data.body, (html) => Section({ body: html, push: true }, ctx))}
        ${ContactInfo(state.linkedDocuments.contact_info_ref, ctx)}
        ${Footer(state.linkedDocuments.footer_ref, ctx)}
      </div>
    </body>
    `
}


function newSubNavigation ({
  currentPageId,
  renderThirdLevel = false
}) {
  var secondLevelItems = []
  var thirdLevelItems = []
  var parents = getParents(currentPageId)
  var level = parents.length + 1

  console.log('LVL ---->', level)

  switch (level) {
    case 1:
      // First level just renders it's children
      var children = getImmediateChildren(currentPageId)
                    .filter(child => Boolean(child.menuLabel))
      children.sort((a, b) => a.numero - b.numero)
      secondLevelItems = children
      break
    case 2:
      // Second level renders it's own siblings...
      let siblings = getSiblings(currentPageId)
                    .filter(child => Boolean(child.menuLabel))
                    .map(markActiveTrail(currentPageId))
      siblings.sort((a, b) => a.numero - b.numero)
      secondLevelItems = siblings

      // ... and it's own children (in a separate nav) if that option is set
      if (renderThirdLevel) {
        let children = getImmediateChildren(currentPageId)
                      .filter(child => Boolean(child.menuLabel))
                      .map(markActiveTrail(currentPageId))
        children.sort((a, b) => a.numero - b.numero)
        thirdLevelItems = children
      }
      break
    case 3:
      // Third level level renders it's immedieate parent's siblings...
      let parentsSiblings = getSiblings(parents[0].id)
                    .filter(child => Boolean(child.menuLabel))
                    .map(markActiveTrail(parents[0].id))
      parentsSiblings.sort((a, b) => a.numero - b.numero)
      secondLevelItems = parentsSiblings

      // ... and it's own siblings (in a separate nav) if that option is set
      if (renderThirdLevel) {
        let siblings = getSiblings(currentPageId)
                      .filter(child => Boolean(child.menuLabel))
                      .map(markActiveTrail(currentPageId))
        siblings.sort((a, b) => a.numero - b.numero)
        thirdLevelItems = siblings
      }
      break
  }

  return html`
    <div class="SubNav">
      <div class="SubNav-container">
        ${secondLevelItems.map(linkObj => {
          return html`<a class="SubNav-link${linkObj.isActive ? ' SubNav-link--active' : ''}" href="${linkObj.path}">${linkObj.menuLabel}</a>`
        })}
      </div>
    </div>
    ${thirdLevelItems.length ? thirdLevelItems.map(linkObj => linkObj.isActive ? `*${linkObj.menuLabel}*`: linkObj.menuLabel).join(' ') : ''}
  `
}

function markActiveTrail (targetId) {
  return function marker (linkObj) {
    if (linkObj.id === targetId) {
      linkObj.isActive = true
    }
    return linkObj
  }
}

function newCharacterNavigation (state) {
  return html`(CHARACTER NAV)`
}
