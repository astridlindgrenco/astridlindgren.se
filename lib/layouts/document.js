// const meta = require('./components/meta')
// const favicon = require('./components/favicon')

/**
 * Create a HTML document
 *
 * @param {object} state
 * @param {any} body
 * @returns {string}
 */

module.exports = function document (body, state, ctx) {
  // TODO use or remove? return minify`
  return `
    <!doctype html>
    <html lang="${(state.lang).substr(0, 2) + '_' + (state.lang).substr(3, 2).toUpperCase()}">
    <head>
      <title>${state.title}</title>
      ${meta(state)}
      ${favicon(state)}
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

      <link rel="manifest" href="/site.webmanifest">
      <link rel="apple-touch-icon" href="/icon.png">
      <link rel="mask-icon" href="/icon.svg" color="#222">

      <link rel="prefetch" href="/al_logo_black.svg">
      <link rel="preconnect" href="//astridlindgren.prismic.io">
      <link rel="preconnect" href="//astridlindgren.cdn.prismic.io">
      <link rel="preconnect" href="//ik.imagekit.io">
      <link rel="preconnect" href="//addsearch.com">

      <!--[if !IE]><!-->
      <link rel="stylesheet" href="/index-${state.version}.css">
      <!--<![endif]-->
      <!--[if IE]>
      <link rel="stylesheet" href="/fallback-${state.version}.css">
      <![endif]-->

      ${(!state.error || state.error.status < 500) ? `
        <script>document.documentElement.classList.add('has-js')</script>
        <script src="/index-${state.version}.js" defer></script>
      ` : ''}
      ${process.env.GOOGLE_ANALYTICS_ID ? `
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
          ga('create', '${process.env.GOOGLE_ANALYTICS_ID}', 'auto');
          ga('send', 'pageview');
          ${state.error && state.error.status >= 500 ? `
            ga('send', 'exception', { exDescription: "${state.error.message}", exFatal: true });
          ` : ''}
        </script>
      ` : ''}
    </head>
        ${body(state, ctx).toString().replace(/<\/body>\s*$/, minify`
            ${process.env.NODE_ENV !== 'development' ? `
              <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex"></script>
            ` : ''}
            <script>window.initialState = ${JSON.stringify(state, replacer)}</script>
            <script src="https://addsearch.com/js/?key=1750d3dacf06ec4893b0cc24034a2b56"></script>
            <script>
              window.prismic = {
                endpoint: 'https://astridlindgren.prismic.io/api/v2'
              };
            </script>
            <script type="text/javascript" src="//static.cdn.prismic.io/prismic.min.js"></script>
          </body>
        `)}
    </html>
  `
}

/**
 * Simple minification removing all new line feeds and leading spaces
 *
 * @param {array} strings Array of string parts
 * @param {array} parts Trailing arguments with expressions
 * @returns {string}
 */
// why? TODO check viability, if so check performance hog
function minify (strings, ...parts) {
  return strings.reduce((output, string, index) => {
    return output + string + (parts[index] || '')
  }, '').replace(/\n\s+/g, '')
}

/**
 * JSON stringify replacer function
 * @param {string} key
 * @param {any} value
 * @return {any}
 */
// TODO check why? or remove
function replacer (key, value) {
  if (typeof value !== 'string') return value

  if (key === 'html') {
    // Remove all line breaks in embedded html
    value = value.replace(/\n+/g, '')
    value = value.replace(/<\//g, '<\\/')
  }

  // Remove special characters and invisible linebreaks
  return value.replace(/[\u2028\u200B-\u200D\uFEFF]/g, '')
}

function meta (state) {
  if (!state) return ''
  else if (!state.meta) return

  return `
      <!-- SEO -->
      <meta property="description" content="${state.meta.description || ''}" />

      <!-- Social -->
      <meta property="og:type" content="website" />
      <meta name="twitter:type" content="website" />
      <meta name="twitter:card" content="summary_large_image">

      <meta name="twitter:title" content="${state.meta.title || ''}"/>
      <meta property="og:title" content="${state.meta.title || ''}"/>

      <meta name="twitter:description" content="${state.meta.description || ''}"/>
      <meta property="og:description" content="${state.meta.description || ''}"/>

      <meta name="twitter:image" content="${state.meta.image || ''}"/>
      <meta property="og:image" content="${state.meta.image || ''}"/>
      ${(() => {
        // We only want this tag if an URL is defined
        return '<meta property="og:url" content="' + process.env.AL_URL + state.url + '"/>' || ''
      })()}
  `
}
function favicon () { return '' }
