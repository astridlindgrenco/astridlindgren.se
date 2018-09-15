var url = require('url')
var html = require('nanohtml')
var { Elements } = require('prismic-richtext')
var { className } = require('../base/utils')
var raw = require('nanohtml/raw')
var linkResolver = require('../../resolve')

module.exports = serialize

function serialize (options = {}) {
  var { classes } = options
  var setClass = optionalClasses(classes || {})
  return function serializer (type, element, content, children) {
    switch (element.type) {
      case Elements.paragraph: return html`<p>${children}</p>`
      case Elements.heading1: return html`<h1 ${raw(setClass('heading1'))} id="${id(element.text)}">${children}</h1>`
      case Elements.heading2: return html`<h2 ${raw(setClass('heading2'))} id="${id(element.text)}">${children}</h2>`
      case Elements.heading3: return html`<h3 ${raw(setClass('heading3'))} id="${id(element.text)}">${children}</h3>`
      case Elements.heading4: return html`<h4 ${raw(setClass('heading4'))} id="${id(element.text)}">${children}</h4>`
      case Elements.heading5: return html`<h5 ${raw(setClass('heading5'))} id="${id(element.text)}">${children}</h5>`
      case Elements.heading6: return html`<h6 ${raw(setClass('heading6'))} id="${id(element.text)}">${children}</h6>`
      case Elements.hyperlink: {
        if (element.data.target && element.data.target === '_blank') {
          return html`<a href="${resolve(element.data)}" target="_blank" rel="noopener noreferrer">${children}</a>`
        }
        return html`<a href="${resolve(element.data)}">${children}</a>`
      }
      case Elements.embed: {
        const provider = element.oembed.provider_name
        switch (provider && provider.toLowerCase()) {
          case 'youtube':
          case 'vimeo': return html`
            <div class="${className('Text-embed', {[`Text-embed--${provider.toLowerCase()}`]: provider})}">
              ${raw(element.oembed.html.replace(/<\\\//g, '</'))}
            </div>
          `
          default: return html`
            <div class="${className('Text-embed', {[`Text-embed--${provider && provider.toLowerCase()}`]: provider})}">
              <a href="${element.oembed.url}">${element.oembed.title}</a>
            </div>
          `
        }
      }
      case Elements.list: {
        // If every element in the list is a link then style it as a link list without bullets
        var isLinkList = children.every(stringElement => stringElement.indexOf('href') !== -1)
        if (isLinkList) {
          return html`<ul class="${className('', {'Text-linkList': isLinkList})}">${raw(children.join(''))}</ul>`
        } else return html`<ul>${raw(children.join(''))}</ul>`
      }
      default: return null
    }
  }

  function optionalClasses (classes) {
    return function setClass (prop) {
      return classes[prop] ? `class="${className('', classes[prop])}"` : ''
    }
  }
}

/**
 * Resolve link fixing Prismic adding protocol to relative links and anchors
 *
 * @param {obj} link
 * @returns str
 */

function resolve (link) {
  if (link.link_type === 'Document') return linkResolver(null, link)
  const { hostname, pathname, hash } = url.parse(link.url)
  if (!hostname) return (pathname || '') + (hash || '')
  if (hostname.indexOf('.') === -1) return '/' + hostname + (pathname || '')
  return link.url
}

/**
 * Generate url friendly string from text
 * @param {str} text
 */

function id (text) {
  return text.replace(/[^\w]/g, '-').replace(/-{2,}/, '-').toLowerCase()
}
