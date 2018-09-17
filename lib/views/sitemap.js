module.exports = (state, ctx) => {
  let output = ''
  ctx.state.sitemap.forEach((link) => {
    console.log(link)
    output += `${link}
`
  })
  // TODO remove post processing in render - output is a plain text file
  return output
}
