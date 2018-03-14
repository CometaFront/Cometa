// Modules
const crypto = require('crypto');
const sharp = require('sharp');
const { Writable } = require('stream');

// Libraries
const pino = attract('lib/pino');

module.exports = res => new Writable({
  objectMode: true,
  write: async (image, encoding, callback) => {
    try {
      let options = { quality: image.output.quality };
      if (image.output.extension === 'png') {
        options = { compressionLevel: 6 };
      }

      sharp(image.body)[image.output.extension](options).on('info', (info) => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        res.writeHead(200, {
          Etag: crypto.createHash('sha1').update(image.body, 'utf8').digest('hex'),
          Expires: expirationDate.toGMTString(),
          Vary: 'Accept-Encoding',
          'Content-Type': `image/${image.output.extension}`,
          'Cache-Control': 'max-age=2592000,public',
          'Content-Length': info.size,
          'Last-Modified': (new Date()).toGMTString(),
          'X-Powered-by': 'https://github.com/aichholzer'
        });
      }).pipe(res);

      return callback();
    } catch (error) {
      pino.error(`Response error: ${error.message}`);
      return callback(error);
    }
  }
}).on('error', pino.error);
