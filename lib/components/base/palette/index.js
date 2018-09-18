var { toCamelCase, ucFirst } = require('../utils')

const colors = []

/* Base */
colors.concat([{
  id: 'Blasvart',
  hex: '#1E272E',
  human_name: 'Blåsvart'
}, {
  id: 'Svart',
  hex: '#222',
  human_name: 'Svart'
}, {
  id: 'Morkgra',
  hex: '#B0B0B0',
  human_name: 'Mörkgrå'
}, {
  id: 'Mellangra',
  hex: '#E0E0DB',
  human_name: 'Mellangrå'
}, {
  id: 'Varmgra',
  hex: '#ECECE6',
  human_name: 'Varmgrå'
}, {
  id: 'Varmvit',
  hex: '#FAFAF5',
  human_name: 'Varmvit'
}, {
  id: 'Ljusgra',
  hex: '#F7F7F7',
  human_name: 'Ljusgrå'
}, {
  id: 'Morkrod',
  hex: '#9D223E',
  human_name: 'Mörkröd'
}, {
  id: 'Mellangron',
  hex: '#86AD9C',
  human_name: 'Mellangrön'
}, {
  id: 'Klargul',
  hex: '#EECF52',
  human_name: 'Klargul'
}, {
  id: 'Gammelrosa',
  hex: '#FDCAC9',
  human_name: 'Gammelrosa'
}, {
  id: 'Ljusrod',
  hex: '#E95C4D',
  human_name: 'Ljusröd'
}, {
  id: 'Ljusgron',
  hex: '#BEE685',
  human_name: 'Ljusgrön'
}, {
  id: 'Orange',
  hex: '#F1AC57',
  human_name: 'Orange'
}, {
  id: 'Blagron',
  hex: '#1B5365',
  human_name: 'Blågrön'
}, {
  id: 'Mellanbla',
  hex: '#6295A6',
  human_name: 'Mellanblå'
}, {
  id: 'Ljusbla',
  hex: '#9ECCD1',
  human_name: 'Ljusblå'
}])

/* Pippi */
colors.concat([{
  id: 'Pippirod',
  hex: '#E72F21',
  human_name: 'Pippiröd'
}, {
  id: 'Pippigul',
  hex: '#FFD800',
  human_name: 'Pippigul'
}, {
  id: 'Pippibla',
  hex: '#009BDE',
  human_name: 'Pippiblå'
}, {
  id: 'Pippigron',
  hex: '#009F67',
  human_name: 'Pippigrön'
}, {
  id: 'Pippibrun',
  hex: '#8D5814',
  human_name: 'Pippibrun'
}, {
  id: 'Pippimellanbrun',
  hex: '#CBA052',
  human_name: 'Pippimellanbrun'
}, {
  id: 'Pippipersika',
  hex: '#FEDDB0',
  human_name: 'Pippipersika'
}, {
  id: 'Pippiljusgron',
  hex: '#54A332',
  human_name: 'Pippiljusgrön'
}, {
  id: 'Pippiljusgul',
  hex: '#FFE964',
  human_name: 'Pippiljusgul'
}, {
  id: 'Pippiorange',
  hex: '#F57E29',
  human_name: 'Pippiorange'
}, {
  id: 'Pippirosa',
  hex: '#F8C8DA',
  human_name: 'Pippirosa'
}, {
  id: 'Pippimorkbla',
  hex: '#254470',
  human_name: 'Pippimörkblå'
}, {
  id: 'Pippiljusblå',
  hex: '#CBE5F9',
  human_name: 'Pippiljusblå'
}])

/* Ronja */
colors.concat([{
  id: 'Ronjabla',
  hex: '#24335C',
  human_name: 'Ronjablå'
}, {
  id: 'Ronjaljusbla',
  hex: '#B2DEEA',
  human_name: 'Ronjaljusblå'
}, {
  id: 'Ronjagron',
  hex: '#005C3F',
  human_name: 'Ronjagrön'
}, {
  id: 'Ronjaljusgron',
  hex: '#9DCB89',
  human_name: 'Ronjaljusgrön'
}, {
  id: 'Ronjarod',
  hex: '#EE7374',
  human_name: 'Ronjaröd'
}, {
  id: 'Ronjaljusrod',
  hex: '#FAC8B1',
  human_name: 'Ronjaljusröd'
}, {
  id: 'Ronjabrun',
  hex: '#C35517',
  human_name: 'Ronjabrun'
}, {
  id: 'Ronjaljusgul',
  hex: '#FFDA64',
  human_name: 'Ronjaljusgul'
}])

/* Emil */
colors.concat([{
  id: 'Emilbla',
  hex: '#2F296A',
  human_name: 'Emilblå'
}, {
  id: 'Emilmellanbla',
  hex: '#8291C6',
  human_name: 'Emilmellanblå'
}, {
  id: 'Emilljusbla',
  hex: '#C0C8E4',
  human_name: 'Emilljusblå'
}, {
  id: 'Emilmorkrod',
  hex: '#960F26',
  human_name: 'Emilmörkröd'
}, {
  id: 'Emilrod',
  hex: '#9B002A',
  human_name: 'Emilröd'
}, {
  id: 'Emilbeige',
  hex: '#F4E0B9',
  human_name: 'Emilbeige'
}, {
  id: 'Emilgammelrosa',
  hex: '#F0CEB7',
  human_name: 'Emilgammelrosa'
}, {
  id: 'Emilgul',
  hex: '#F5E46E',
  human_name: 'Emilgul'
}, {
  id: 'Emilmorkbrun',
  hex: '#68420F',
  human_name: 'Emilmörkbrun'
}, {
  id: 'Emilsand',
  hex: '#C69900',
  human_name: 'Emilsand'
}, {
  id: 'Emiltrad',
  hex: '#694A42',
  human_name: 'Emilträd'
}, {
  id: 'Emilmorkgron',
  hex: '#6295A6',
  human_name: 'Emilmörkgrön'
}, {
  id: 'Emilljusgron',
  hex: '#D1E3AA',
  human_name: 'Emilljusgrön'
}])

/* Legacy Colors */
colors.concat([
  {
    /** Pippi **/
    id: 'dark_green',
    hex: '#009F67',
    human_name: 'Pippi Grön'
  },
  {
    /** Pippi **/
    id: 'pippi_yellow',
    hex: '#ffd800',
    human_name: 'Pippi Gul'
  },
  {
    /** Kato */
    id: 'blue_black',
    hex: '#6295a6',
    human_name: 'Kato svart'
  },
  {
    /** Pepper */
    id: 'warm_gray',
    hex: '#ecece6',
    human_name: 'Pepper varmgrå'
  },
  {
    /** Undis */
    id: 'slate_blue',
    hex: '#6295a6',
    human_name: 'Undis mellanblå'
  },
  {
    /** Söderhavet */
    id: 'light_blue',
    hex: '#9eccd1',
    human_name: 'Söderhavet ljusblå'
  },
  {
    /** Darköga */
    id: 'dark_blue',
    hex: '#1b5365',
    human_name: 'Draköga blågrön'
  },
  {
    /** Melker */
    id: 'slate_green',
    hex: '#86ad9c',
    human_name: 'Melker mellangrön'
  },
  {
    /** Rövare */
    id: 'light_green',
    hex: '#bee685',
    human_name: 'Rövare ljusgrön'
  },
  {
    /** Tjorven */
    id: 'yellow',
    hex: '#eecf52',
    human_name: 'Tjorven klargul'
  },
  {
    /** Lukas */
    id: 'light_orange',
    hex: '#f1ac57',
    human_name: 'Lukas orange'
  },
  {
    /** Villa Villekulla */
    id: 'peach',
    hex: '#fdcac9',
    human_name: 'Villa Villakulla gammelrosa'
  },
  {
    /** Ida */
    id: 'light_red',
    hex: '#e95c4d',
    human_name: 'Ida ljusröd'
  },
  {
    /** Katthult */
    id: 'dark_red',
    hex: '#9d223e',
    human_name: 'Katthult mörkröd'
  }
])

module.exports = {
  getClassName (name) {
    if (!name) return ucFirst(toCamelCase(colors[0].id, '_'))

    const color = colors.find(color => color.human_name.toLowerCase() === name.toLowerCase())
    return color ? ucFirst(toCamelCase(color.id, '_')) : undefined
  },
  getHexCode (name) {
    if (!name) return colors[0].hex

    const color = colors.find(color => color.human_name.toLowerCase() === name.toLowerCase())
    if (color && color.hex) return color.hex
    else return colors[0].hex
  },
  colors
}
