
module.exports = function defaultStore (ctx) {
  return {
    version: process.env.npm_package_version,
    lang: process.env.AL_LANG,
    url: process.env.AL_URL,
    locale: null,
    error: null,
    ref: null,
    routeName: null,
    requestQuery: {},
    params: {},
    ui: {
      header: {
        nav: {
          isToggled: false
        },
        search: {
          isToggled: false
        },
        lang: {
          isToggled: false
        }
      },
      locales: null
    },
    query: ctx.query,
    pages: {
      items: [],
      error: null,
      isLoading: false
    },
    characters: {
      items: [],
      error: null,
      isLoading: false
    },
    quotes: {
      items: [],
      error: null,
      isLoading: false
    },
    linkedDocuments: {}
  }
}
