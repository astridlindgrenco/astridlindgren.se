'use strict'

const Router = require('koa-router')
const render = require('../render')
const locale = require('../locale')
const getRefs = require('./helpers/getRefs')
const fetchSubnavigation = require('./helpers/fetchSubnavigation')
const updateNavigation = require('./helpers/updateNavigation')
var Prismic = require('prismic-javascript')

const router = module.exports = new Router()

router.get('/boklista',
  async function (ctx, next) {
    const langCode = locale.getCode(ctx.state.lang)
    // get page
    const bookListOptions = { lang: langCode }
    console.log('booklist', bookListOptions)
    const doc = await ctx.prismic.getSingle('booklist', bookListOptions)
    ctx.assert(doc, 500, 'Content missing')
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title[0].text
    // get books
    const bookOptions = { lang: langCode }
    const booksQuery = await ctx.prismic.query([
      Prismic.Predicates.at('document.type', 'book')
    ], bookOptions)
    ctx.state.books = booksQuery.results || []
    // get the rest
    await getRefs(doc, ctx)
    await fetchSubnavigation(doc, ctx, next)
    await next()
  },
  render(require('../views/booklist'))
)
