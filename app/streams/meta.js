// Modules
const sharp = require('sharp');
const { Transform } = require('stream');

// Libraries
const pino = attract('lib/pino');

module.exports = () => new Transform({
  objectMode: true,
  transform: (image, encoding, callback) => setImmediate(() => {
    sharp(image)
      .metadata()
      .then(metadata => callback(null, { image, metadata }))
      .catch(callback);
  })
}).on('error', pino.error);
