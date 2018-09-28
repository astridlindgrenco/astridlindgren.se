'use strict'
const Koa = require('koa')
const body = require('koa-body')
const serve = require('koa-static')
const compress = require('koa-compress')
const helmet = require('koa-helmet')
const cacheControl = require('koa-cache-control')
const noTrailingSlash = require('koa-no-trailing-slash')
// const app = require('./lib/app')
const router = require('./lib/router')
const render = require('./lib/render')
const errors = require('./lib/errors')
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

if (process.env.NODE_ENV !== 'development') {
  server.use(helmet())
  server.use(cacheControl({
    maxAge: 600,
    public: true
  }))
}

/**
 * Capture special routes before any other middleware
 */

// server.use(api)
// server.use(redirects)

/**
 * Remove trailing slashes before continuing
 */

server.use(noTrailingSlash())

/**
 * Serve static files
 */

server.use(assets)
server.use(serve('public', { maxage: 1000 * 60 * 60 * 24 * 365 }))

/**
 * Add on Universal Analytics for server process tracking
 */

// server.use(analytics(process.env.GOOGLE_ANALYTICS_ID))

/**
 * Set up request cache mechanism
 */

// server.use(cache)

/**
 * Parse request body
 */

server.use(body())

/**
 * Set default stores
 */

server.use(stores)

//
/**
 * Handle rendering response
 */

// server.use(render())

/**
 * Hook up the Prismic api
 */

server.use(prismic)
server.use(lang)
server.use(navigation)

/**
 * Hook up em' routes
 */

if (process.env.NODE_ENV !== 'development') {
  // Compress html
  server.use(compress())
}

server.use(render)
server.use(errors)
server.use(router)

/**
 * Lift off
 */
server.listen(process.env.PORT, () => {
  // Add time to console.log
  // FIXME: logging framework?
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
