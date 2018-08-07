var html = require('nanohtml')
var Section = require('../components/section')
var Header = require('../components/header')
var Card = require('../components/card')
var { asText } = require('prismic-richtext')

module.exports = function home (state) {
  var doc = state.pages.items.find(doc => doc.type === 'home')
  return html`
    <div class="Page">
      ${Section({
        body: Header(state.navDocument, false)
      })}
      ${Section({
        body: html`
          <h1>${asText(doc.data.title)}</h1>
        `
      })}
      ${Section({
        push: true,
        body: html`
          <div class="Grid Grid--withGutter Grid--equalHeight">
            <div class="Grid-cell u-lg-size1of2">
              ${Card({
                category: 'Sångerna',
                image: {
                  src: 'http://placehold.it/704x352/999999/aaaaaa?text=2:1',
                  alt: ''
                },
                title: {
                  text: 'Vargsången',
                  lvl: 2
                },
                body: html`
                  <p>Vargen ylar i nattens skog, han vill men kan inte sova. Hungern river hans vargabuk, och det är kallt i hans stova… </p>
                `,
                cta: {
                  href: '#',
                  label: 'Hör fler sånger'
                }
              })}
            </div>
            <div class="Grid-cell u-lg-size1of2">
            ${Card({
              category: 'Visste du att',
              image: {
                src: 'http://placehold.it/704x352/999999/aaaaaa?text=2:1',
                alt: ''
              },
              body: html`
                <p><strong>Astrid Lindgrens verk finns översatt till 101 språk – från afrikaans till älvdalska!</strong></p>
              `,
              cta: {
                href: '#',
                label: 'Läs mer om Astrid Lindgren'
              }
            })}
            </div>
          </div>
        `
      })}
      ${Section({
        push: true,
        body: html`
          <div class="Grid Grid--withGutter Grid--equalHeight">
            <div class="Grid-cell u-lg-size1of2">
              ${Card({
                category: 'Barndomen & Uppväxten',
                image: {
                  src: 'http://placehold.it/704x352/999999/aaaaaa?text=2:1',
                  alt: ''
                },
                body: html`
                  <p>”Om någon frågar mig vad jag minns från barndomstiden, så är min första tanke ändå inte människorna. Utan naturen som omslöt mina dagar då och fyllde dem så intensivt”</p>
                `,
                cta: {
                  href: '#',
                  label: 'Upptäck mer'
                }
              })}
            </div>
            <div class="Grid-cell u-lg-size1of2">
            ${Card({
              category: 'Visste du att',
              body: html`
                <p>I slutet av 30-talet blev Astrid sekreterare åt Harry Söderman, docent i kriminologi vid Stockholms högskola. Han skrev ett kompendium i kriminalteknik och dikterade för Astrid som tog till sig kunskapen och senare kunde använda den i egna böcker – om Mästerdetektiv Blomkvist.</p>
              `,
              cta: {
                href: '#',
                label: 'Upptäck mer'
              }
            })}
            </div>
          </div>
        `
      })}
    </div>
  `
}
