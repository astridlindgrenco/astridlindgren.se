'use strict'

/**
 * Render of the page type 'page'.
 */

const html = require('nanohtml')
const asElement = require('prismic-element')
const { linkResolver, getParents, getImmediateChildren } = require('../resolve')
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

module.exports = (state, ctx) => {
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
          ${Section(newSubNavigation({ currentPageId: doc.id }))}
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
  currentPageId
}) {
  // Get children
  var children = getImmediateChildren(currentPageId)
                .filter(child => Boolean(child.menuLabel))
  // Get parents
  var parents = getParents(currentPageId)
                .filter(child => Boolean(child.menuLabel))
                .map(markActiveTrail(currentPageId))
  // Sort children on numero
  children.sort((a, b) => a.numero - b.numero)
  parents.sort((a, b) => a.numero - b.numero)
  // Ingen menuLabel = visa inte i menyn
  // Mark isActive
  // Render children

  var level = 1
  if (children.length && !parents.length) level = 1
  if (children.length && parents.length) level = 2
  if (!children.length && parents.length) level = 3

  return html`
    <ul>
      ${children.map(child => {
        return html`<li><a class="${child.isActive ? 'link-active' : ''}" href="${child.path}">${child.menuLabel}</a></li>`
      })}
    </ul>
  `
}

function markActiveTrail (targetId) {
  return function marker (linkObj) {
    if (linkObj.id === targetId || linkObj.parentId === targetId) {
      linkObj.isActive = true
    }
    return linkObj
  }
}

function newCharacterNavigation (state) {
  return html`(CHARACTER NAV)`
}
