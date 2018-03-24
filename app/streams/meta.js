// Modules
const sharp = require('sharp');
const { Transform } = require('stream');

// Libraries
const pino = require('../lib/pino');

module.exports = () => new Transform({
  objectMode: true,
  transform: (image, encoding, callback) => setImmediate(() => {
    sharp(image.body)
      .metadata()
      .then((metadata) => {
        image.metadata = metadata;
        callback(null, image);
      })
      .catch(callback);
  })
}).on('error', pino.error);
