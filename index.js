'use strict'
const Koa = require('koa')
const body = require('koa-body')
const etag = require('koa-etag')
const serve = require('koa-static')
const helmet = require('koa-helmet')
const rewrite = require('koa-rewrite')
const cacheControl = require('koa-cache-control')
const noTrailingSlash = require('koa-no-trailing-slash')
const router = require('./lib/router')
const render = require('./lib/render')
const assets = require('./lib/middleware/assets')
const stores = require('./lib/middleware/stores')
const prismic = require('./lib/middleware/prismic')
const lang = require('./lib/middleware/lang')
const navigation = require('./lib/middleware/navigation')
const linked = require('./lib/middleware/linked')
const os = require('os')

const server = new Koa()

/**
 * Compile and serve assets on demand during development
 */

if (process.env.NODE_ENV === 'development') {
  // Serve live client resources
  server.use(require('./lib/middleware/watchify'))
  server.use(require('./lib/middleware/postcss'))

  // Serve components assets from disk
  server.use(serve('lib'))
}

/**
 * Always clean up headers, even during development
 */
server.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", 'astridlindgren.prismic.io', 'astridlindgren.cdn.prismic.io', 'vars.hotjar.com'],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'embed.typeform.com', 'www.youtube.com', 'addsearch.com/', '*.hotjar.com/', 'static.cdn.prismic.io/', 'cdnjs.cloudflare.com/ajax/libs/cookieconsent2/', 'www.googletagmanager.com', 'www.google-analytics.com', 'cdn.polyfill.io', 's6.searchcdn.com'],
    styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com/ajax/libs/cookieconsent2/', 'hello.myfonts.net/count/', 'app.addsearch.com', '*.cloudfront.net'],
    imgSrc: ["'self'", 'data:', 'images.prismic.io', 'astridlindgren.cdn.prismic.io', 'www.google-analytics.com', 'd20vwa69zln1wj.cloudfront.net', '*.addsearch.com', 'addsearch.com'],
    connectSrc: ["'self'", 'in.hotjar.com', 'vc.hotjar.io', 'astridlindgren.prismic.io', 'www.google-analytics.com', 'stats.g.doubleclick.net'],
    frameSrc: ["'self'", 'www.youtube.com', 'astridlindgren.prismic.io', 'astridlindgren.typeform.com', 'vars.hotjar.com'],
    frameAncestors: ["'self'", 'astridlindgren.typeform.com'],
    fontSrc: ["'self'", 'data:'] } }))

/**
 * Remove trailing slashes before continuing
 */

server.use(noTrailingSlash())

/*
 * Rewrite main CSS and JS paths (which uses a Cache Busting filename on the client)
 * to the plain filename on the server so we can serve it regardless of which
 * version the client requests (as it could request an old version depending on other caching)
 */
server.use(rewrite('/index-(.*).css', '/index.css'))
server.use(rewrite('/index-(.*).js', '/index.js'))

/**
 * Serve static files
 */
const MS_ONE_DAY = 1000 * 60 * 60 * 24
const MS_ONE_MONTH = MS_ONE_DAY * 30
server.use(assets)
server.use(serve('public', { maxage: MS_ONE_MONTH }))

/**
 * Cache pages a short time, like 6 minutes.
 */

server.use(cacheControl({
  maxAge: MS_ONE_DAY
}))

/**
 * Add Etag to pages
 */

server.use(etag())

/**
 * Parse request body
 */

server.use(body())

/**
 * Set default stores
 */

server.use(stores)

/**
 * Hook up the Prismic api
 */

server.use(prismic)
server.use(lang)

/**
 * Hook up em' routes
 */

server.use(router)

/**
 * Middlewares for rendering
 */

server.use(navigation)
server.use(linked)
server.use(render)

/**
 * Lift off
 */

server.listen(process.env.PORT, () => {
  // Add time to console.log
  if (console && console.log) {
    const old = console.log
    console.log = function () {
      const date = new Date()
      Array.prototype.unshift.call(arguments, `[${date.toDateString()} ${date.toLocaleTimeString('sv-SE')}.${date.getMilliseconds()}]`)
      old.apply(this, arguments)
    }
  }

  console.log(`[Server] 🚀 Listening on ${os.hostname()}:${process.env.PORT}`)
})
