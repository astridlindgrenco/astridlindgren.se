var { toCamelCase, ucFirst } = require('../utils')

var colors = [
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
]

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
