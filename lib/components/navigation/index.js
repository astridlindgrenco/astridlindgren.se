'use strict'

const html = require('nanohtml')
const { asText } = require('prismic-richtext')
const DOM = require('prismic-dom')

module.exports = function navigation(nav) {
    let items = ''
    console.log(nav)
    /*
    nav.data.menu_links.forEach(menu_link => {
        items += `
        <li class="Header-navItem">
          <a class="Header-link" href="${menu_link.link.slug}">
            ${menu_link.label[0].text}
          </a>
        </li>`
    })*/
    return items
}
