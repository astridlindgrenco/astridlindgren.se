
module.exports = function defaultStore (ctx) {
  return {
    version: process.env.npm_package_version,
    lang: process.env.AL_LANG,
    error: null,
    ref: null,
    routeName: null,
    params: {},
    ui: {},
    query: ctx.query,
    isEditor: false,
    pages: {
      items: [],
      error: null,
      isLoading: false
    },
    quotes: {
      items: [],
      error: null,
      isLoading: false
    }
  }
}
