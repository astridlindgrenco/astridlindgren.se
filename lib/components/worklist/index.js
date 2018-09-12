'use strict'

/**
 * Render works (books, movies, etc) according to view type: grid or list.
 */

const html = require('nanohtml')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const linkResolver = require('../../resolve')
const serializer = require('../text/serializer')

module.exports = function Worklist ({
  documents,
  propHandlers,
  workDetails,
  viewBy,
  emptyView
}) {
  if (!documents.length && emptyView) return emptyResult(emptyView)
  var workObjects = createWorkObjects(documents, workDetails, propHandlers)
  if (viewBy === 'list') {
    return asList(workObjects)
  } else {
    return asGrid(workObjects)
  }
}

function createWorkObjects (documents, workDetails = [], propHandlers = {}) {
  return documents.map(function createWorkObject (doc) {
    // Get the props we need optionally with provied handler function
    var basic = [
      'title',
      'cover',
      'year',
      'abstract'
    ].map(function getProperty (prop) {
      var propHandler = propHandlers[prop]
      return {[prop]: propHandler ? propHandler(doc) : doc.data[prop]}
    })
    var details = []
    if (workDetails.length) {
      details = workDetails.map(function addDetailProperty ({label, prop, blacklist = []}) {
        var propHandler = propHandlers[prop]
        var detailProp = propHandler ? propHandler(doc) : doc.data[prop]
        // Filter against optionally provided blacklist of prop values
        if (detailProp && blacklist.indexOf(detailProp) === -1) {
          return {
            label,
            prop,
            value: detailProp
          }
        }
      }).filter(Boolean)
    }
    return Object.assign({ details }, ...basic)
  })
}

function emptyResult (body) {
  return html`
    <div class="Grid Grid--withGutter">
      <div class="Grid-cell">
        <div class="Text">
          ${asElement(body)}
        </div>
      </div>
    </div>
  `
}

function asList (works) {
  return html`
  <div class="Worklist Worklist--listview">
    <ul class="Worklist-list">
      ${works.map(listWork)}
    </ul>
  </div>
  `
}

function asGrid (works) {
  return html`
  <div class="Worklist Worklist--gridview">
    <div class="Worklist-grid">
      <div class="Grid Grid--withGutter">
        ${works.map(gridWork)}
      </div>
    </div>
  </div>
  `
}

function listWork (work) {
  const title = asText(work.title)
  const cover = work.cover
  const authorYear = work.year
  const abstract = asElement(work.abstract, linkResolver, serializer())
  const workDetails = work.details.map(function createDetailView ({label, value}) {
    return html`
      <div class="Worklist-detail">
        <p><strong>${label}:</strong> ${value}</p>
      </div>`
  })
  return html`
    <div class="Worklist-item">
      <div class="Grid Grid--withGutter">
        <div class="Grid-cell u-md-size1of4 u-lg-size1of4">
          <img class="Worklist-cover" src="${cover.url}" title="${cover.copyright}">
        </div>
        <div class="Grid-cell u-md-size3of4 u-lg-size3of4">
          <div class="Text">
            <h2 class="Text-h3 Worklist-title">${title}</h2>
            <div class="Worklist-authorYear">
              <p>${authorYear}</p>
            </div>
            ${workDetails}
            <div class="Text--smaller Worklist-abstract">${abstract}</div>
          </div>
        </div>
      </div>
    </div>
  `
}

function gridWork (work) {
  const title = asText(work.title)
  const cover = work.cover
  const authorYear = work.year
  const authors = work.details.find(detail => detail.prop === 'authors')
  return html`
    <div class="Grid-cell u-sm-size1of1 u-md-size1of3 u-lg-size1of5">
      <div class="Worklist-item">
        <img class="Worklist-cover"
              src="${cover.url}"
              alt="${cover.alt}">
        <div class="Text Text--smaller">
          <h2 class="Text-h4 Worklist-title">${title}</h2>
          ${authors ? html`<p class="Text-small Worklist-detail">${authors.value}</p>` : ''}
          <p class="Text-small Worklist-authorYear">${authorYear}</p>
        </div>
      </div>
    </div>
  `
}
