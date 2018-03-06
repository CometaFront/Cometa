const crypto = require('crypto');
const sharp = require('sharp');
const { Writable } = require('stream');

module.exports = (res, next) => new Writable({
  objectMode: true,
  write: async (image, encoding, callback) => {
    try {
      let options = { quality: image.output.quality };
      if (image.output.extension === 'png') {
        options = { compressionLevel: 5 };
      }

      setImmediate(() => {
        sharp(image.body)[image.output.extension](options).once('info', (info) => {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30);

          const headers = {
            'Content-Type': `image/${image.output.extension}`,
            'Cache-Control': 'max-age=2592000,public',
            Expires: expirationDate.toGMTString(),
            'Content-Length': info.size,
            'Last-Modified': (new Date()).toGMTString(),
            Etag: crypto.createHash('sha1').update(image.body, 'utf8').digest('hex'),
            Vary: 'Accept-Encoding'
          };

          res.set(headers);
        }).pipe(res);
        callback();
      });
    } catch (error) {
      callback(error);
    }
  }
}).once('error', next);
