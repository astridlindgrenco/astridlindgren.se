var Koa = require('koa')
var body = require('koa-body')
var serve = require('koa-static')
var helmet = require('koa-helmet')
var noTrailingSlash = require('koa-no-trailing-slash')
//var app = require('./lib/app')
var router = require('./lib/router')
var assets = require('./lib/middleware/assets')
var stores = require('./lib/middleware/stores')
var prismic = require('./lib/middleware/prismic')

var server = new Koa()


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

//server.use(api)
//server.use(redirects)

/**
 * Remove trailing slashes before continuing
 */

server.use(noTrailingSlash())

/**
 * Serve static files
 */

server.use(assets)
// fixme: public saknas, vi har lib?
server.use(serve('public', { maxage: 1000 * 60 * 60 * 24 * 365 }))

/**
 * Add on Universal Analytics for server process tracking
 */

//server.use(analytics(process.env.GOOGLE_ANALYTICS_ID))

/**
 * Set up request cache mechanism
 */

//server.use(cache)

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

//server.use(render())

/**
 * Hook up the Prismic api
 */

server.use(prismic)

/**
 * Hook up em' routes
 */

server.use(router)

/**
 * Lift off
 */

server.listen(process.env.PORT, () => {
  console.info(`🚀  Server listening at localhost:${process.env.PORT}`)
})
