'use strict'

// const Prismic = require('prismic-javascript')

module.exports = async (doc, ctx, next) => {
  console.log(doc.data)
  ctx.state.meta = {
    title: doc.data.seo_title || undefined,
    description: doc.data.seo_title || undefined,
    image: doc.data.seo_image || undefined
  }
}
