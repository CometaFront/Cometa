// Modules
const sharp = require('sharp');
const { Transform } = require('stream');

// Libraries
const pino = require('../lib/pino');

const transformStream = async (image, encoding, callback) => setImmediate(() => {
  if (image.output.width > 0 || image.output.height > 0) {
    return sharp(image.body)
      .resize(image.output.width, image.output.height)
      .withoutEnlargement()
      .toBuffer()
      .then((body) => {
        image.body = body;
        return callback(null, image);
      })
      .catch(callback);
  }

  return callback(null, image);
});

module.exports = () => new Transform({
  objectMode: true,
  transform: transformStream
}).on('error', pino.error);
