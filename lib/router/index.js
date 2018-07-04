var compose = require('koa-compose');

/**
 * Application routes with language specific routes stacked on top
 */

const routes = [
  //require('./prismic')
]

const views = [
  require('./home'),
  require('./page')
]

routes.push.apply(routes, views)


//module.exports = compose([router.routes(), router.allowedMethods()])

/**
 * Application routes with language specific routes stacked on top
 */
/*
Object.keys(languages).forEach(lang => {
  if (lang === process.env.GLOBALGOALS_LANG) return

  views.forEach(route => {
    const middleware = compose([setLanguage, route.routes(), route.allowedMethods()])
    routes.push(mount('/' + lang, middleware))
  })

  function setLanguage (ctx, next) {
    ctx.state.lang = lang
    return next()
  }
})

routes.push.apply(routes, views)*/

/**
 * Compose all routes
 */

module.exports = compose(routes.reduce((stack, middleware) => {
  // Non-router middleware are just passed on as-is
  if (!middleware.stack) return stack.concat(middleware)
  return stack.concat(middleware.routes(), middleware.allowedMethods())
}, []))
