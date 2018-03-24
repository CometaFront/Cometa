// Modules
const { Transform } = require('stream');

// Libraries
const pino = require('../lib/pino');

const filterImage = (image) => {
  const fn = async (resolve, reject) => {
    const filter = image.output.filter.shift().split(/[:]+/);
    if (filter.length) {
      const name = filter[0].trim();
      const param = filter[1];

      try {
        const filterModule = require.call(this, `filters/${name}`);
        image.body = await filterModule(image, param);
        image.filters.push({ filter: name, error: null });
        return fn(resolve, reject);
      } catch (error) {
        if (error.message.indexOf('Cannot find module') >= 0) {
          image.filters.push({ filter: name, error: error.message });
          return fn(resolve, reject);
        }

        return reject(error);
      }
    }

    return resolve(image);
  };

  return new Promise((resolve, reject) => fn(resolve, reject));
};

module.exports = () => new Transform({
  objectMode: true,
  transform: (image, encoding, callback) => setImmediate(() => {
    if (!image.output.filter) {
      return callback(null, image);
    }

    image.filters = []; // Collect meta data on applied filters.
    image.output.filter = image.output.filter.replace(/[^0-9a-z:,-]/gi, '').split(/[,]+/);
    return filterImage(image)
      .then((filtered) => callback(null, filtered))
      .catch((error) => {
        pino.warn(`Filter error: ${error.message}`);
        return callback(null, image);
      });
  })
}).on('error', pino.error);
