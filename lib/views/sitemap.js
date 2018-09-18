module.exports = (state, ctx) => {
  let output = ''
  ctx.state.sitemap.forEach((link) => {
    output += `${link}<br>
`
  })
  // TODO remove <br> above and post processing in render - output is a plain text file
  return output
}
