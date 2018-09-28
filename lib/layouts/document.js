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
  return `
    <!doctype html>
    <html lang="${state.locale}">
    <head>
      <title>${state.title}</title>
      ${meta(state)}
      ${favicon(state)}
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">

      <link rel="manifest" href="/site.webmanifest">
      <link rel="apple-touch-icon" href="/icon.png">
      <link rel="mask-icon" href="/icon.svg" color="#222">

      <link rel="prefetch" href="/al_logo_black.svg">
      <link rel="preconnect" href="//astridlindgren.prismic.io">
      <link rel="preconnect" href="//astridlindgren.cdn.prismic.io">
      <link rel="preconnect" href="//ik.imagekit.io">
      <link rel="preconnect" href="//addsearch.com">
      <link rel="preconnect" href="https://in.hotjar.com">

      <!--[if !IE]><!-->
      <link rel="stylesheet" href="/index-${state.version}.css">
      ${getCustomFontStylesheet(state.font)}
      <!--<![endif]-->
      <!--[if IE]>
      <link rel="stylesheet" href="/fallback-${state.version}.css">
      <![endif]-->

      <!-- Cookies -->
      <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.0/cookieconsent.min.css" />
      <script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.0/cookieconsent.min.js"></script>
      <script>
        window.addEventListener("load", function(){
        window.cookieconsent.initialise({
          "palette": {
            "popup": {
              "background": "#333"
            },
            "button": {
              "background": "#ffd200"
            }
          }
        })});
      </script>

      <!-- Details polyfill -->
      <script src="https://cdn.jsdelivr.net/npm/details-polyfill@1.1.0/index.min.js"></script>

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

      ${process.env.GOOGLE_TAG_MANAGER_ID ? `
        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${process.env.GOOGLE_TAG_MANAGER_ID}');</script>
        <!-- End Google Tag Manager -->` : ''}

      <!-- Hotjar Tracking Code for https://www.astridlindgren.com -->
      <script>
      (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:1010661,hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      </script>
    </head>
        ${body(state, ctx).toString().replace(/<\/body>\s*$/, minify`
            ${process.env.NODE_ENV !== 'development' ? `
              <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex"></script>
            ` : ''}
            <script>window.initialState = ${getClientState(state)}</script>
            <script src="https://addsearch.com/js/?key=1750d3dacf06ec4893b0cc24034a2b56"></script>
          </body>
        `)}
    </html>
  `
}

function getClientState ({
  ui,
  navDocument,
  locales
}) {
  return JSON.stringify({
    ui,
    navDocument,
    locales
  }, replacer)
}

/**
 * JSON stringify replacer function
 * @param {string} key
 * @param {any} value
 * @return {any}
 */
// TODO check why? or remove
var util = require('util')
function replacer (key, value) {
  // check for known circular objects
  if (typeof value === 'object') {
    const object = util.inspect(value, {depth: 0})
    if (object.indexOf('Time') === 0) {
      // Timeout and Timer object is circular - just remove them
      return null
    }
  }

  if (typeof value !== 'string') return value

  if (key === 'html') {
    // Remove all line breaks in embedded html
    value = value.replace(/\n+/g, '')
    value = value.replace(/<\//g, '<\\/')
  }

  // Remove special characters and invisible linebreaks
  return value.replace(/[\u2028\u200B-\u200D\uFEFF]/g, '')
}

function getCustomFontStylesheet (fontName) {
  if (!fontName || typeof fontName !== 'string') return ''
  return `<link rel="stylesheet" href="/fonts/custom-font-${fontName.toLowerCase()}.css">`
}

function meta (state) {
  if (!state) return ''
  else if (!state.meta) return ''

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
