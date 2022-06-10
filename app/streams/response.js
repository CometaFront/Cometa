const crypto = require('crypto');
const sharp = require('sharp');
const { Writable } = require('stream');
const log = require('../lib/log');

const writeHead = (res, image, size) => {
  const Etag = crypto.createHash('sha1').update(image.body, 'utf8').digest('hex');

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);

  return res.writeHead(200, {
    Etag,
    Expires: expirationDate.toGMTString(),
    Vary: 'Accept-Encoding',
    'Content-Type': `image/${image.output.extension}`,
    'Cache-Control': 'max-age=2592000,public',
    'Content-Length': size,
    'Last-Modified': new Date().toGMTString(),
    'X-Powered-by': 'https://github.com/aichholzer'
  });
};

const writeStream = function write(res, image, encoding, callback) {
  setImmediate(() => {
    try {
      let options = { quality: image.output.quality };
      if (image.output.extension === 'png') {
        options = { compressionLevel: 6 };
      }

      image.output.extension = image.output.extension === 'jpg' ? 'jpeg' : image.output.extension;
      return sharp(image.body, { failOnError: true })
        [image.output.extension](options)
        .on('info', (info) => writeHead(res, image, info.size))
        .on('error', (error) => callback(error))
        .pipe(res);
    } catch (error) {
      return callback(error);
    }
  });
};

module.exports = (res) =>
  new Writable({
    objectMode: true,
    write: writeStream.bind(null, res)
  }).on('error', log.error);
