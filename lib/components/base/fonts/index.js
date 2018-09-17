const fonts = [
  {
    id: 'Pippi',
    class: 'u-font-pippi'
  },
  {
    id: 'Emil',
    class: 'u-font-emil'
  },
  {
    id: 'Ronja',
    class: 'u-font-ronja'
  },
  {
    id: 'Bröderna Lejonhjärta',
    class: 'u-font-broderna'
  },
  {
    id: 'Bullerbyn',
    class: 'u-font-bullerbyn'
  },
  {
    id: 'Lotta på Bråkmakargatan',
    class: 'u-font-lotta'
  },
  {
    id: 'Karlsson',
    class: 'u-font-karlsson'
  }
]

module.exports = function getCustomFont (id) {
  if (!id) return fonts[0].class

  const font = fonts.find(font => font.id.toLowerCase() === id.toLowerCase())
  return font ? font.class : null
}
