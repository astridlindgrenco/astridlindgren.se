'use strict'

const Router = require('koa-router')
const Prismic = require('prismic-javascript')
const locale = require('../locale')
const getRefs = require('./helpers/getRefs')
const fetchSubnavigation = require('./helpers/fetchSubnavigation')
const updateNavigation = require('./helpers/updateNavigation')

const router = module.exports = new Router()

router.get('/:langCode/*',
  async function (ctx, next) {
    if (ctx.view) return next()
    ctx.view = 'page'

    // Split url into array of params
    // FIXME: Handle query and anchor
    const params = ctx.params['0'].split('/')

    // uid is always last item in params
    const uid = params[params.length - 1]

    const lang = locale.getLang(ctx.params.langCode)
    const options = { lang: lang }

    // we only handle 2 sub-directories for now
    if (params.length > 2) {
      console.log('[Page] Sub-path is longer than two.. redirecting..')
      const uri = '/' + lang + '/' + params[params.length - 2] + '/' + params[params.length - 1]
      ctx.redirect(uri)
      return next()
    }

    const doc = await ctx.prismic.getByUID('page', uid, options)

    ctx.assert(doc, 404, `404: ${uid} not found`)
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title ? doc.data.title[0].text : 'Rubrik saknas'
    ctx.state.uid = uid
    ctx.state.url = `/${lang}/${params.join('/')}`
    ctx.state.params = params

    console.log('[Router->Page] params: ' + JSON.stringify(params))

    await getRefs(doc.data, ctx)
    var sliceBody = doc.data.body

    if (ctx.state.linkedDocuments['parent_page']) {
      // TODO: Redirect to correct page???
      ctx.assert(ctx.state.linkedDocuments['parent_page'].values().next().value.uid === params[params.length - 2], 404, `404: ${uid} not found`)
    }

    if (sliceBody && sliceBody.length) {
      let hasCharacterSlice = sliceBody.some(slice => slice.slice_type === 'characters')
      if (hasCharacterSlice) {
        await ctx.prismic.query(
          [ Prismic.Predicates.at('document.type', 'page'),
            Prismic.Predicates.at('document.tags', ['Karaktär']) ],
          {
            fetch: ['page.title', 'page.list_image'],
            orderings: '[my.page.title]'
          }
        ).then(function (response) {
          ctx.state.characters.items.push(...response.results)
          return response.results
        })
      }
    }

    try {
      await fetchSubnavigation(doc, ctx, next)
      await updateNavigation(doc, ctx, next)
    } catch (ex) {
      console.log('[Page] threw: ' + JSON.stringify(ex))
    }
    await next()
  }
)
