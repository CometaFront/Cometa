/* eslint no-console: 0 */

const fs = require('fs')
const server = require('http').createServer()
const port = 10000

server
  .on('request', (req, res) => {
    res.setHeader('Content-Type', 'image/jpeg')
    fs
      .createReadStream(`./test/support${req.url}`)
      .on('error', () => {
        res.statusCode = 404
        res.end()
      })
      .pipe(res)
  })
  .listen(port, () => console.log(`Up: ${port}`))
