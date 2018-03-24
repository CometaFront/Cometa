// Modules
const crypto = require('crypto');
const sharp = require('sharp');
const { Writable } = require('stream');

// Libraries
const pino = require('../lib/pino');

const writeHead = (res, body, size, extension) => {
  const Etag = crypto
    .createHash('sha1')
    .update(body, 'utf8')
    .digest('hex');

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);

  return res.writeHead(200, {
    Etag,
    Expires: expirationDate.toGMTString(),
    Vary: 'Accept-Encoding',
    'Content-Type': `image/${extension}`,
    'Cache-Control': 'max-age=2592000,public',
    'Content-Length': size,
    'Last-Modified': new Date().toGMTString(),
    'X-Powered-by': 'https://github.com/aichholzer'
  });
};

const writeStream = async (res, image, encoding, callback) => setImmediate(() => {
  let options = { quality: image.output.quality };
  if (image.output.extension === 'png') {
    options = { compressionLevel: 6 };
  }

  image.output.extension = image.output.extension === 'jpg' ? 'jpeg' : image.output.extension;
  sharp(image.body)[image.output.extension](options)
    .on('info', (info) => writeHead(res, image.body, info.size, image.output.extension))
    .pipe(res);

  return callback();
});

module.exports = (res) => new Writable({
  objectMode: true,
  write: writeStream.bind(null, res)
}).on('error', pino.error);
