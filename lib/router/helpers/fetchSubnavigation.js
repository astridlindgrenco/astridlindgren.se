'use strict'

var Prismic = require('prismic-javascript')

/**
 * Create sub navigation data according to the hierarchical content strategy,
 * which is: a child document is linked to a parent document. If the document
 * is a parent page, then it must find out the child pages, if any. If the document
 * is a child page it must find out it's siblings.
 */
module.exports = async function fetchSubnavigation (doc, ctx, next, force) {
  if (!doc || !doc.data) return next()

  const options = { lang: ctx.state.lang, orderings: '[my.page.numero]' }
  const parentPage = doc.data.parent_page
  let pageId = (parentPage.id)
    // I'm a child page, look for my siblings
    ? parentPage.id
    // I'm a parent page, look for my children
    : doc.id

  if (ctx.state.params.length > 1 && !force) pageId = doc.id

  const subDocsArr = await Promise.all([
    await ctx.prismic.query([
      Prismic.Predicates.at('my.page.parent_page', pageId)
    ], options),
    await ctx.prismic.query([
      Prismic.Predicates.at('my.listpage.parent_page', pageId)
    ], options)
  ])
  ctx.state.subNav = []
  //  build menu items from subDocs
  if (Array.isArray(subDocsArr)) {
    subDocsArr.forEach(subDocs => {
      subDocs.results.forEach(subDoc => {
        if (!subDoc.data.menu_label) return

        let active = false
        for (let i = 0; i < ctx.state.params.length; i++) {
          if (active) break
          active = (subDoc.uid === ctx.state.params[i])
        }

        ctx.state.subNav.push({
          id: subDoc.id,
          uid: subDoc.uid,
          type: subDoc.type,
          lang: subDoc.lang,
          title: subDoc.title,
          label: subDoc.data.menu_label,
          isActive: (subDoc.id === doc.id) || active,
          parentUID: (!force) ? doc.uid : parentPage.uid,
          numero: subDoc.data.numero,
          link_type: 'Document'
        })
      })
    })
    ctx.state.subNav.sort((a, b) => a.numero - b.numero)
  }

  if (ctx.state.subNav.length <= 0 && !force) await fetchSubnavigation(doc, ctx, next, true)

  if (ctx.state.params.length > 1 && !ctx.state.parentSubNav) {
    const page = await ctx.prismic.query([Prismic.Predicates.at('my.page.uid', ctx.state.params[0])], options)

    const subDocsArr = await Promise.all([
      await ctx.prismic.query([
        Prismic.Predicates.at('my.page.parent_page', page.results[0].id)
      ], options)
    ])

    ctx.state.parentSubNav = []
    if (Array.isArray(subDocsArr)) {
      subDocsArr.forEach(subDocs => {
        subDocs.results.forEach(subDoc => {
          if (!subDoc.data.menu_label) return

          console.log(subDoc.uid, ctx.state.params[ctx.state.params.length - 1], subDoc.uid === ctx.state.params[ctx.state.params.length - 1])

          let active = false
          for (let i = 0; i < ctx.state.params.length; i++) {
            if (active) break
            active = (subDoc.uid === ctx.state.params[i])
          }

          ctx.state.parentSubNav.push({
            id: subDoc.id,
            uid: subDoc.uid,
            type: subDoc.type,
            lang: subDoc.lang,
            title: subDoc.title,
            label: subDoc.data.menu_label,
            isActive: (subDoc.id === doc.id) || active,
            parentUID: (!force) ? doc.uid : parentPage.uid,
            numero: subDoc.data.numero,
            link_type: 'Document'
          })
        })
      })
      ctx.state.parentSubNav.sort((a, b) => a.numero - b.numero)
    }
  }
}
