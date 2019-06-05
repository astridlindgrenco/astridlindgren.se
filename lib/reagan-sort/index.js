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

  search (fields, sort, input, d) {
    let data = d || this.sort(sort)
    data = this.filter(sort, data, input)

    let res = []
    for (let i = 0; i < data.length; i++) {
      for (const key in data[i]) {
        try {
          // console.log(key, data[i][key])
          if (data[i] && data[i][key] &&
            (typeof data[i][key] === 'string'
              ? data[i][key] : data[i][key].toString())
              .toLowerCase().indexOf(input.toLowerCase()) !== -1) {
            if (!(res.includes(data[i]))) res.push(data[i])
          }
        } catch (ex) { continue }
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
