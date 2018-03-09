const crypto = require('crypto');
const sharp = require('sharp');
const { Writable } = require('stream');

module.exports = (res) => new Writable({
  objectMode: true,
  write: async (image, encoding, callback) => {
    try {
      let options = { quality: image.output.quality };
      if (image.output.extension === 'png') {
        options = { compressionLevel: 5 };
      }

      console.log('Response stream');
      sharp(image.body)[image.output.extension](options).once('info', (info) => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        res.setHeader('Content-Type', `image/${image.output.extension}`);
        res.setHeader('Cache-Control', 'max-age=2592000,public');
        res.setHeader('Expires', expirationDate.toGMTString());
        res.setHeader('Content-Length', info.size);
        res.setHeader('Last-Modified', (new Date()).toGMTString());
        res.setHeader('Etag', crypto.createHash('sha1').update(image.body, 'utf8').digest('hex'));
        res.setHeader('Vary', 'Accept-Encoding');
      }).pipe(res);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}).once('error', console.log);
