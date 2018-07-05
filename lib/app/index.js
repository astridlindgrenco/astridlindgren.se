module.exports = start
function start () {

  console.log('starting client app')

  /**
   * More possible uses for this app when things are in state (from Prismic etc)
   * - Last call alter of state i.e. meta
   * - Pick the view to be rendered based on UID
   */

  /**
   * Hook up development tools
   */

  if (process.env.NODE_ENV === 'development') {

  }

  return {}
}

document.addEventListener('DOMContentLoaded', start)
