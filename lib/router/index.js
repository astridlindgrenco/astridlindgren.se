'use strict'

/**
 * Application routes with language specific routes stacked on top.
 */

const compose = require('koa-compose')

const routes = [
  require('./lang')
]

const views = [
  require('./preview'),
  require('./home'),
  require('./newsroom'),
  require('./booklist'),
  require('./page')
]

routes.push.apply(routes, views)

// Compose all routes.
module.exports = compose(routes.reduce((stack, middleware) => {
  if (!middleware.stack) {
    // Non-router middleware are just passed on as-is.
    return stack.concat(middleware)
  } else {
    return stack.concat(middleware.routes(), middleware.allowedMethods())
  }
}, []))
