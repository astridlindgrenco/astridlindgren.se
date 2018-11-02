'use strict'
const Koa = require('koa')
const body = require('koa-body')
const serve = require('koa-static')
const helmet = require('koa-helmet')
const cacheControl = require('koa-cache-control')
const noTrailingSlash = require('koa-no-trailing-slash')
const router = require('./lib/router')
const render = require('./lib/render')
const assets = require('./lib/middleware/assets')
const stores = require('./lib/middleware/stores')
const prismic = require('./lib/middleware/prismic')
const lang = require('./lib/middleware/lang')
const navigation = require('./lib/middleware/navigation')

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
 * Take extra care to clean up em' headers in production
 */

if (process.env.NODE_ENV === 'production') {
  server.use(helmet())
}

/**
 * Set cache header
 */

if (process.env.NODE_ENV === 'production') {
  server.use(cacheControl({
    maxAge: 600, /* 10 minutes */
    public: true
  }))
} else {
  server.use(cacheControl({
    noChache: true,
    noStore: true,
    mustRevalidate: true
  }))
}

/**
 * Remove trailing slashes before continuing
 */

server.use(noTrailingSlash())

/**
 * Serve static files
 */
const MS_ONE_DAY = 1000 * 60 * 60 * 24
const MS_ONE_MONTH = MS_ONE_DAY * 30
server.use(assets)
server.use(serve('public', { maxage: MS_ONE_MONTH }))

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
server.use(navigation)

/**
 * Hook up em' routes
 */

server.use(router)

/**
 * Middlewares for rendering
 */

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

  console.log(`[Server] 🚀 Listening on localhost:${process.env.PORT}`)
})
