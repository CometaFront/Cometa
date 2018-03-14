// Modules
const { Transform } = require('stream');

// Libraries
const pino = attract('lib/pino');

const filterImage = (image) => {
  const fn = async (yes, no) => {
    const filter = (image.output.filter.shift()).split(/[:]+/);
    if (filter.length) {
      const name = filter[0].trim();
      const param = filter[1];

      try {
        const filterModule = attract(`filters/${name}`);
        image.body = await filterModule(image, param);
        image.filters.push({ filter: name, error: null });
        return fn(yes, no);
      } catch (error) {
        if (error.message.indexOf('Cannot find module') >= 0) {
          image.filters.push({ filter: name, error: error.message });
          return fn(yes, no);
        }

        return no(error);
      }
    }

    return yes(image);
  };

  return new Promise((yes, no) => fn(yes, no));
};

module.exports = () => new Transform({
  objectMode: true,
  transform: async (image, encoding, callback) => {
    if (!image.output.filter) {
      return callback(null, image);
    }

    try {
      image.filters = []; // Collect meta data on applied filters.
      image.output.filter = image.output.filter.replace(/[^0-9a-z:,-]/gi, '').split(/[,]+/);
      return callback(null, await filterImage(image));
    } catch (error) {
      pino.warn(`Filter error: ${error.message}`);
      return callback(null, image);
    }
  }
}).on('error', pino.error);