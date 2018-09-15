'use strict'

var Koa = require('koa')
var body = require('koa-body')
var serve = require('koa-static')
var compress = require('koa-compress')
var helmet = require('koa-helmet')
var noTrailingSlash = require('koa-no-trailing-slash')
// var app = require('./lib/app')
var router = require('./lib/router')
var render = require('./lib/render')
var errors = require('./lib/errors')
var assets = require('./lib/middleware/assets')
var stores = require('./lib/middleware/stores')
var prismic = require('./lib/middleware/prismic')
var lang = require('./lib/middleware/lang')
var navigation = require('./lib/middleware/navigation')
const NodeCache = require('node-cache')

var server = new Koa()

/**
 *  Cache for navigation links
 */
server.context.db = new NodeCache()

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
}

/**
 * Prevent indexing everything but production
 */

if (process.env.NODE_ENV !== 'production') {
  server.use(require('./lib/middleware/robots'))
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
    let date = new Date()

    var old = console.log
    console.log = function () {
      Array.prototype.unshift.call(arguments, '[' + date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }) + ']')
      old.apply(this, arguments)
    }
  }

  console.log(`[Server] 🚀 Listening on localhost:${process.env.PORT}`)
})
