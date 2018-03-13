// Modules
const sharp = require('sharp');
const { Transform } = require('stream');

// Libraries
const log = attract('core/lib/log');

module.exports = () => new Transform({
  objectMode: true,
  transform: (image, encoding, callback) => {
    try {
      setImmediate(async () => {
        image.metadata = await sharp(image.body).metadata();
        callback(null, image);
      });
    } catch (error) {
      callback(error);
    }
  }
}).on('error', log.error);
