// Modules
const path = require('path');

const supportedInput = ['webp', 'png', 'tiff', 'jpeg', 'jpg'];
const supportedOutput = ['webp', 'png', 'tiff', 'jpeg', 'jpg'];

module.exports = (req) => {
  let input = req.path;
  const { query } = req;

  const fileName = path.basename(input).split('.');
  const outputExtension = fileName.pop();
  const inputExtension = fileName.pop();

  if (supportedInput.includes(inputExtension) && supportedOutput.includes(outputExtension)) {
    input = input.replace(`.${outputExtension}`, '');
  }

  if (!supportedOutput.includes(outputExtension)) {
    throw new Error(`.${outputExtension} files are not supported.`);
  }

  const { source } = req.params;
  const outputQuality = parseInt(query.q || query.quality, 10) || 80;
  return {
    output: {
      width: parseInt(query.w || query.width, 10) || null,
      height: parseInt(query.h || query.height, 10) || null,
      quality: outputQuality > 0 && outputQuality <= 100 ? outputQuality : 80,
      filter: query.f || query.filter || null,
      extension: outputExtension
    },
    source: source ? source.toUpperCase() : null,
    input: input || null
  };
};
