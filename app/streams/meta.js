const sharp = require('sharp');
const { Transform } = require('stream');
const pino = require('../lib/pino');

const transformStream = (image, encoding, callback) =>
  setImmediate(() => {
    sharp(image.body)
      .metadata()
      .then((metadata) => {
        image.metadata = metadata;
        callback(null, image);
      })
      .catch(callback);
  });

module.exports = () =>
  new Transform({
    objectMode: true,
    transform: transformStream
  }).on('error', (error) => pino.error(error));
