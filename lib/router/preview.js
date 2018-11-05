'use strict'

const Router = require('koa-router')
const router = module.exports = new Router()
const Prismic = require('prismic-javascript')
const { __ } = require('../locale')

router.get(process.env.PRISMIC_PREVIEW, async function (ctx, next) {
  const token = ctx.request.query.token
  console.log('[Preview] token:', token)
  const url = await ctx.prismic.previewSession(token, linkResolver, '/')
  console.log('[Preview] url:', url)
  ctx.cookies.set(Prismic.previewCookie, token, { maxAge: 30 * 60 * 1000, path: '/', httpOnly: false })

  ctx.redirected = true
  ctx.redirect(url)
})

const linkResolver = function (doc) {
  const locale = doc.lang.substring(0, 2)
  switch (doc.type.toLowerCase()) {
    case 'home':
      return `/${locale}`
    case 'page':
      return `/${locale}/preview/${doc.uid}`
    case 'book':
      return `/${locale}/${__('book')}/${doc.uid}`
    case 'movie':
      return `/${locale}/${__('movie')}/${doc.uid}`
    case 'listpage':
      if (doc.uid === __('booklist')) return `/${locale}/${__('the works')}/${__('booklist')}`
      if (doc.uid === __('movielist')) return `/${locale}/${__('the works')}/${__('movielist')}`
      if (doc.uid === __('quotes')) return `/${locale}/${__('quotes')}`
      break
    case 'newsdesk':
      return `/${locale}/${__('newsdesk')}`
    case 'citatsida':
      return `/${locale}/${__('quotes')}`
    default:
      return `/${locale}/${doc.uid}#broken-${doc.type}`
  }
}