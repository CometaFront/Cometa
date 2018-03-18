// Modules
const sharp = require('sharp');
const { Transform } = require('stream');

// Libraries
const pino = attract('lib/pino');

module.exports = () => new Transform({
  objectMode: true,
  transform: (image, encoding, callback) => setImmediate(() => {
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
  })
}).on('error', pino.error);
