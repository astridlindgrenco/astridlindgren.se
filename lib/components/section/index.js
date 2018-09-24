var html = require('nanohtml')
var raw = require('nanohtml/raw')
var palette = require('../base/palette')
var { className } = require('../base/utils')
var { getLocales } = require('../../locale')

module.exports = section
function section (data) {
  if (data && data.body) {
    var {
      body,
      header,
      footer,
      isFill,
      isFillSmall,
      isFillLarge,
      isUnconstrained,
      isNarrow,
      isExpandable,
      toggleLabel,
      push,
      pullTop,
      bg,
      noPadding
    } = data
  } else {
    body = data
  }
  // We double check for length because to guard for { body: '' },
  // nanohtml object has length and therefore passes the test
  if (!body || !body.length) return null
  var bgClassName = bg ? palette.getClassName(bg) : ''
  var classes = className('Section', {
    'Section--noPadding': noPadding,
    'Section--fill': isFill,
    'Section--fillSmall': isFillSmall,
    'Section--fillLarge': isFillLarge,
    'Section--pullTop': pullTop,
    'Section--unconstrained': isUnconstrained,
    'Section--narrow': isNarrow,
    'Section--marginVerSmall': push,
    'Section--hasBgColor': bg,
    [`u-bg${bgClassName}`]: bg,
    [`u-colorFor${bgClassName}`]: bg
  })
  if (isExpandable && !toggleLabel) {
    let locales = getLocales()
    toggleLabel = {
      show: locales.show_more,
      hide: locales.show_less
    }
  }

  return html`
    <div class="${classes}" ${setupContainer(isExpandable)}>
      <div class="Section-body ${bg ? `u-colorFor${bgClassName}` : ''}">
        ${sectionHeader(header)}
        ${body}
        ${sectionFooter(footer)}
      </div>
      ${isExpandable && toggleLabel ? sectionToggle(toggleLabel, pullTop) : ''}
    </div>
  `
}

function sectionHeader (content) {
  return content ? html`<div class="Section-header">${content}</div>` : ''
}

function sectionFooter (content) {
  return content ? html`<div class="Section-footer">${content}</div>` : ''
}

function sectionToggle (labels, topAlign) {
  return html`
    <button data-labels='${raw(JSON.stringify(labels))}' class="Section-toggle js-toggle${topAlign ? ' Section-toggle--topAlign' : ''}">
      ${labels.show}
    </button>
  `
}

function setupContainer (isExpandable) {
  var options = {
    isExpandable,
    collapsed: true
  }
  return isExpandable ? raw(` data-container="section" data-options='${JSON.stringify(options)}'`) : ''
}
