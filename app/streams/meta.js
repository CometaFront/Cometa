const sharp = require('sharp');
const { Transform } = require('stream');
const log = require('../lib/log');

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
  }).on('error', log.error);
