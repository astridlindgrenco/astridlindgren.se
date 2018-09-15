'use strict'
const NodeCache = require('node-cache')

module.exports = async function nodeCahe (ctx, next) {
  console.log('[Middleware->NodeCache]')
  ctx.state.nodeCache = new NodeCache()
  return next()
}
