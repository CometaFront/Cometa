const sharp = require('sharp');
const { Transform } = require('stream');
const pino = require('../lib/pino');

const transformStream = (image, encoding, callback) =>
  setImmediate(() => {
    const { output = {} } = image;
    const { width = null, height = null } = output;

    if (!width && !height) {
      return callback(null, image);
    }

    return sharp(image.body)
      .resize(width, height)
      .withoutEnlargement()
      .toBuffer()
      .then((body) => {
        image.body = body;
        callback(null, image);
      })
      .catch(callback);
  });

module.exports = () =>
  new Transform({
    objectMode: true,
    transform: transformStream
  }).on('error', (error) => pino.error(error));
