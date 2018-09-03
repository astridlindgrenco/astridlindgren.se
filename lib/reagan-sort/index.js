/*
  ReaganSort
  by Filiph Sandström

  let Ronald = new ReaganSort([
    { id: '1', title: 'q'},
    { id: '3', title: 'b'},
    { id: '4', title: 'c'},
    { id: '2', title: 'c', meaning: '42'},
  ])

  // Sort by title, id
  Ronald.sort(['title', 'id'])
  console.log([
    { id: '3', title: 'b'},
    { id: '2', title: 'c', meaning: '42'},
    { id: '4', title: 'c'},
    { id: '1', title: 'q'},
  ])

  // Sort by title reverse
  Ronald.sort(['-title'])
  console.log([
    { id: '4', title: 'c'},
    { id: '3', title: 'b'},
    { id: '2', title: 'c', meaning: '42'},
    { id: '1', title: 'q'},
  ])

  // Filter by meaning
  Ronald.filter(['meaning'])
  console.log([
    { id: '2', title: 'c', meaning: '42'},
  ])

  // Search title and sort by id reverse
  Ronald.search(['title'], ['-id'], 'c')
  console.log([
    { id: '4', title: 'c'},
    { id: '2', title: 'c', meaning: '42'},
  ])
*/

class ReaganSort {
  constructor (data) {
    this.data = data || []
  }

  sort (fields, d) {
    let data = d || JSON.parse(JSON.stringify(this.data))
    data.sort(fieldSorter([...fields]))
    return data
  }

  filter (fields, d) {
    let data = d || JSON.parse(JSON.stringify(this.data))

    for (let n = data.length; n >= 0; --n) {
      let found = false

      for (var item in data[n]) {
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i]

          if (data[n][field] && item === field) found = true
        }
      }

      if (!found) {
        data.splice(n, 1)
      }
    }
    return data
  }

  search (fields, sort, input) {
    let data = this.sort(sort)
    data = this.filter(sort, data)

    let res = []
    for (let i = 0; i < data.length; i++) {
      for (const key in data[i]) {
        if (data[i] && data[i][key] && (typeof data[i][key] === 'string' ? data[i][key] : data[i][key].toString()).indexOf(input) !== -1) res.push(data[i])
      }
    }

    return res
  }
}

// https://stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields
const fieldSorter = (fields) => (a, b) => fields.map(o => {
  let dir = 1
  if (o[0] === '-') { dir = -1; o = o.substring(1) }
  return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0
}).reduce((p, n) => p || n, 0)

module.exports = ReaganSort
