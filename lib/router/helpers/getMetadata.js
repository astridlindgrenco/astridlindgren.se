'use strict'

// const Prismic = require('prismic-javascript')

module.exports = async (doc, ctx, next) => {
  ctx.state.meta = {
    title: doc.data.seo_title || undefined,
    description: doc.data.seo_description || undefined,
    image: (doc.data.seo_image ? doc.data.seo_image.url : undefined)
  }
}
