const sharp = require('sharp');
const { Transform } = require('stream');
const log = require('../lib/log');

const transformStream = (image, encoding, callback) =>
  setImmediate(() => {
    const { output = {} } = image;
    const { width = null, height = null } = output;

    if (!width && !height) {
      return callback(null, image);
    }

    return sharp(image.body)
      .resize(width, height, { withoutEnlargement: true })
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
  }).on('error', log.error);
