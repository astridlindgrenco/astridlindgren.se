'use strict'

const Router = require('koa-router')
const Prismic = require('prismic-javascript')
const { asText } = require('prismic-richtext')
const getRefs = require('./helpers/getRefs')
const getMetadata = require('./helpers/getMetadata')
const fetchSubnavigation = require('./helpers/fetchSubnavigation')
const updateNavigation = require('./helpers/updateNavigation')

const router = module.exports = new Router()

router.get('/:locale/*',
  async function (ctx, next) {
    if (ctx.view) return next()
    ctx.view = 'page'

    // Split url into array of params
    // FIXME: Handle query and anchor
    const params = ctx.params['0'].split('/')

    // uid is always last item in params
    const uid = params[params.length - 1]

    // we only handle 2 sub-directories for now
    /* if (params.length > 2) {
      console.log('[Page] Sub-path is longer than two.. redirecting..')
      const uri = '/' + lang + '/' + params[params.length - 2] + '/' + params[params.length - 1]
      ctx.redirected = true
      ctx.redirect(uri)
      return next()
    } */

    const options = { lang: ctx.state.lang }
    const doc = await ctx.prismic.getByUID('page', uid, options)

    ctx.assert(doc, 404, `404: ${uid} not found`)
    ctx.state.pages.items.push(doc)
    ctx.state.title = doc.data.title ? asText(doc.data.title) : 'Rubrik saknas'
    ctx.state.uid = uid
    ctx.state.url = `/${ctx.state.locale}/${params.join('/')}`
    ctx.state.params = params
    ctx.state.is_character_menu = doc.data.is_character_menu === 'Ja'
    ctx.state.font = doc.data.font_id

    // console.log('[Router->Page] params: ' + JSON.stringify(params))

    await getRefs(doc.data, ctx)
    var sliceBody = doc.data.body

    if (ctx.state.linkedDocuments['parent_page']) {
      // TODO: Redirect to correct page???
      // ctx.assert(ctx.state.linkedDocuments['parent_page'].values().next().value.uid === params[params.length - 2], 404, `404: ${uid} not found`)
    }

    if (ctx.state.is_character_menu) {
      ctx.state.character_menu = {
        title: doc.data.character_menu_title,
        accent: doc.data.character_menu_color
      }
    }

    if (sliceBody && sliceBody.length) {
      let characterSlice = sliceBody.find(slice => slice.slice_type === 'characters')
      let prismicPredicates = []
      let prismicOpts = {
        fetch: ['page.title', 'page.list_image'],
        orderings: '[my.page.title]'
      }

      if (characterSlice) {
        if (characterSlice.primary.should_list_auto === 'Ja') {
          prismicPredicates = [
            Prismic.Predicates.at('document.type', 'page'),
            Prismic.Predicates.at('document.tags', ['Karaktär', 'Huvudsida'])
          ]
        // If it has priority or manually added characters fetch by ID
        } else if (characterSlice.items.length) {
          prismicPredicates = [ Prismic.Predicates.in('document.id', characterSlice.items.map(item => item.priority_character.id)) ]
        }
        await ctx.prismic.query(
          prismicPredicates,
          prismicOpts
        ).then((response) => {
          if (!response || !response.results) return
          if (!doc || !doc.data || !doc.data.list_image) return
          var resultsWithImage = response.results.filter(doc => Boolean(doc.data.list_image.url))
          ctx.state.characters.items.push(...resultsWithImage)
          return response.results
        })
      }
    }

    try {
      let metadata = getMetadata(doc, ctx, next)
      let subnavigation = fetchSubnavigation(doc, ctx, next)
      let navigation = updateNavigation(doc, ctx, next)
      await Promise.all([metadata, subnavigation, navigation])
    } catch (ex) {
      console.log('[Page] threw: ' + JSON.stringify(ex))
    }
  }
)
