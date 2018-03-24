// Modules
const sharp = require('sharp');
const { Transform } = require('stream');

// Libraries
const pino = require('../lib/pino');

const transformStream = async (image, encoding, callback) =>
  setImmediate(() =>
    sharp(image.body)
      .resize(image.output.width, image.output.height)
      .withoutEnlargement()
      .toBuffer()
      .then((body) => {
        image.body = body;
        callback(null, image);
      })
      .catch(callback)
  );

module.exports = () =>
  new Transform({
    objectMode: true,
    transform: transformStream
  }).on('error', pino.error);
