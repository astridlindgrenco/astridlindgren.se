const fonts = [
  {
    id: 'Pippi',
    class: 'font-pippi'
  },
  {
    id: 'Emil',
    class: 'font-emil'
  },
  {
    id: 'Ronja',
    class: 'font-ronja'
  },
  {
    id: 'Bröderna Lejonhjärta',
    class: 'font-broderna'
  },
  {
    id: 'Bullerbyn',
    class: 'font-bullerbyn'
  },
  {
    id: 'Lotta på Bråkmakargatan',
    class: 'font-lotta'
  },
  {
    id: 'Karlsson',
    class: 'font-karlsson'
  }
]

module.exports = (id) => {
  if (!id) return fonts[0].class

  const font = fonts.find(font => font.id.toLowerCase() === id.toLowerCase())
  return font ? font.class : null
}
