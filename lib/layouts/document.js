const { getCustomFontStylesheet } = require('../components/base/fonts')

/**
 * Create a HTML document
 *
 * @param {object} body - A Html fragmen representing the <body/> content
 * @param {object} ctx - The Koa context.
 * @returns {string} - The complete Htlm document.
 */

module.exports = function document (view, ctx) {
  return `
    <!doctype html>
    <html lang="${ctx.state.locale}">
    <head>
      <title>${ctx.state.title}</title>
      ${meta(ctx.state)}
      ${favicon()}
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">

      <link rel="manifest" href="/site.webmanifest">
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#222">

      <link rel="prefetch" href="/al_logo_black.svg">
      <link rel="prefetch" href="/al_logo_white.svg">
      <link rel="preconnect" href="https://astridlindgren.prismic.io">
      <link rel="preconnect" href="https://images.prismic.io">
      <link rel="preconnect" href="https://addsearch.com">
      <link rel="preconnect" href="https://app.addsearch.com">
      <link rel="preconnect" href="https://in.hotjar.com">
      <link rel="preconnect" href="https://script.hotjar.com">
      <link rel="preconnect" href="https://static.hotjar.com">
      <link rel="preconnect" href="https://cdn.jsdelivr.net">
      <link rel="preconnect" href="https://cdnjs.cloudflare.com">

      <!--[if !IE]><!-->
      <link rel="stylesheet" href="/index-${ctx.state.version}.css">
      ${getCustomFontStylesheet(ctx.state.font)}
      <!--<![endif]-->
      <!--[if IE]>
      <link rel="stylesheet" href="/fallback-${ctx.state.version}.css">
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

      <!-- Preview -->
      <script>
        window.prismic = { endpoint: 'https://astridlindgren.prismic.io/api/v2' };
      </script>
      <script type="text/javascript" src="//static.cdn.prismic.io/prismic.min.js"></script>

      ${(!ctx.state.error || ctx.state.error.status < 500) ? `
        <script>document.documentElement.classList.add('has-js')</script>
        <script src="/index-${ctx.state.version}.js" defer></script>
      ` : ''}
      ${process.env.GOOGLE_ANALYTICS_ID ? `
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
          ga('create', '${process.env.GOOGLE_ANALYTICS_ID}', 'auto');
          ga('send', 'pageview');
          ${ctx.state.error && ctx.state.error.status >= 500 ? `
            ga('send', 'exception', { exDescription: "${ctx.state.error.message}", exFatal: true });
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
        ${view(ctx).toString().replace(/<\/body>\s*$/, `
            ${process.env.NODE_ENV !== 'development' ? `
              <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.includes,Array.prototype.find,Array.prototype.findIndex"></script>
            ` : ''}
            <script>window.initialState = ${getClientState(ctx.state)}</script>
            <script src="https://addsearch.com/js/?key=1750d3dacf06ec4893b0cc24034a2b56"></script>
          </body>
        `)}
    </html>
  `
}

function getClientState ({
  ui,
  navDocument,
  locales,
  locale,
  langs
}) {
  return JSON.stringify({
    ui,
    navDocument,
    locales,
    locale,
    langs
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
    const object = util.inspect(value, { depth: 0 })
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

function meta (state) {
  return `
    <!-- SEO -->
    <meta property="description" content="${state.doc.data.seo_description || ''}" />

    <!-- Social -->
    <meta property="og:type" content="website" />
    <meta name="twitter:type" content="website" />
    <meta name="twitter:card" content="summary_large_image">

    <meta name="twitter:title" content="${state.doc.data.seo_title || ''}"/>
    <meta property="og:title" content="${state.doc.data.seo_title || ''}"/>

    <meta name="twitter:description" content="${state.doc.data.seo_description || ''}"/>
    <meta property="og:description" content="${state.doc.data.seo_description || ''}"/>

    <meta name="twitter:image" content="${state.doc.data.seo_image ? state.doc.data.seo_image.url : ''}"/>
    <meta property="og:image" content="${state.doc.data.seo_image ? state.doc.data.seo_image.url : ''}"/>

    <meta property="og:url" content="${state.url || ''}"/>
  `
}

function favicon () {
  return `
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  `
}
