'use strict'

const Router = require('koa-router')
const Prismic = require('prismic-javascript')
const render = require('../render')
const locale = require('../locale')
const getRefs = require('./helpers/getRefs')
const fetchSubnavigation = require('./helpers/fetchSubnavigation')
const updateNavigation = require('./helpers/updateNavigation')

const router = module.exports = new Router()

router.get('/:path/:sub_path?',
  async function (ctx, next) {
    const uid = ctx.params.sub_path || ctx.params.path
    const langCode = locale.getCode(ctx.state.lang)
    const options = { lang: langCode }
    const doc = await ctx.prismic.getByUID('page', uid, options)
    ctx.assert(doc, 404, `404 NOT FOUND ${uid}`)
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title ? doc.data.title[0].text : 'Rubrik saknas'
    ctx.state.uid = uid
    ctx.state.url = '/' + ctx.params.path + '/' + (ctx.params.subpath || '')
    await getRefs(doc.data, ctx)
    var sliceBody = doc.data.body
    if (sliceBody && sliceBody.length) {
      let hasCharacterSlice = sliceBody.some(slice => slice.slice_type === 'characters')
      if (hasCharacterSlice) {
        var characters = await ctx.prismic.query(
          [ Prismic.Predicates.at('document.type', 'page'),
            Prismic.Predicates.at('document.tags', ['Karaktär']) ],
            {
              fetch : ['page.title', 'page.list_image'],
              orderings : '[my.page.title]'
            }
        ).then(function(response) {
          ctx.state.characters.items.push(...response.results)
          return response.results
        })
      }
    }
    await fetchSubnavigation(doc, ctx, next)
    await updateNavigation(doc, ctx, next)
    await next()
  },
  render(require('../views/page'))
)
