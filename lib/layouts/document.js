//const meta = require('./components/meta')
//const favicon = require('./components/favicon')

/**
 * Create a HTML document
 *
 * @param {object} state
 * @param {any} body
 * @returns {string}
 */

module.exports = function document (body, state) {
  // TODO use or remove? return minify`
  return `
    <!doctype html>
    <html lang="${state.lang}">
    <head>
      <title>${state.title}</title>
      ${meta(state)}
      ${favicon(state)}
      <link rel="manifest" href="/site.webmanifest">
      <link rel="apple-touch-icon" href="/icon.png">
      <link rel="mask-icon" href="/icon.svg" color="#222">
      <link rel="dns-prefetch" href="//globalgoals.cdn.prismic.io">

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
        ${body(state).toString().replace(/<\/body>\s*$/, minify`
            ${process.env.NODE_ENV !== 'development' ? `
              <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex"></script>
            ` : ''}
            <script>window.initialState = ${JSON.stringify(state, replacer)}</script>
            <script src="https://addsearch.com/js/?key=1750d3dacf06ec4893b0cc24034a2b56"></script>
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


function meta () { return '' }
function favicon () { return '' }
