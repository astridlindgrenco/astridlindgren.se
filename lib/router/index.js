'use strict'

/**
 * Application routes
 */

const compose = require('koa-compose')

const routes = [
  require('./hook'),
  require('./preview'),
  require('./home'),
  require('./newsdesk'),
  require('./worklist'),
  require('./book'),
  require('./movie'),
  require('./quotes'),
  require('./page'),
  require('./404')
]

// Compose all routes.
module.exports = compose(routes.reduce((stack, middleware) => {
  if (!middleware.stack) {
    // Non-router middleware are just passed on as-is.
    return stack.concat(middleware)
  } else {
    return stack.concat(middleware.routes(), middleware.allowedMethods())
  }
}, []))
