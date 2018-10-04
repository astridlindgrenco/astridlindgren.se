const fonts = [
  {
    id: 'Pippi',
    class: 'u-font-pippi',
    stylesheet: 'pippi'
  },
  {
    id: 'Emil',
    class: 'u-font-emil',
    stylesheet: 'emil'
  },
  {
    id: 'Ronja',
    class: 'u-font-ronja',
    stylesheet: 'ronja'
  },
  {
    id: 'Bröderna Lejonhjärta',
    class: 'u-font-broderna',
    stylesheet: 'broderna'
  },
  {
    id: 'Bullerbyn',
    class: 'u-font-bullerbyn',
    stylesheet: 'bullerbyn'
  },
  {
    id: 'Lotta på Bråkmakargatan',
    class: 'u-font-lotta',
    stylesheet: 'lotta'
  },
  {
    id: 'Karlsson',
    class: 'u-font-karlsson',
    stylesheet: 'karlsson'
  }
]

exports.getCustomFontClass = function getCustomFontClass (fontName) {
  if (!fontName) {
    return fonts[0].class
  }
  const font = fonts.find(font => font.id.toLowerCase() === fontName.toLowerCase())
  return font ? font.class : null
}

exports.getCustomFontStylesheet = function getCustomFontClass (fontName) {
  if (!fontName || typeof fontName !== 'string') {
    return ''
  }
  const font = fonts.find(font => font.id.toLowerCase() === fontName.toLowerCase())
  return font ? `<link rel="stylesheet" href="/fonts/custom-font-${font.stylesheet.toLowerCase()}.css">` : ''
}
