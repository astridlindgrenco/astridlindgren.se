var store = require('../app/stores')

module.exports = function stores (ctx, next) {
  ctx.state = Object.assign(store(ctx), ctx.state)
  return next()
}
