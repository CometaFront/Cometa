// Modules
const path = require('path');

const supportedInput = ['webp', 'png', 'tiff', 'jpeg', 'jpg'];
const supportedOutput = ['webp', 'png', 'tiff', 'jpeg', 'jpg'];

module.exports = (req) => {
  let input = req.path;
  const { query } = req;

  const fileName = path.basename(input).split('.');
  const outputExtension = fileName.pop();
  const supportedOutputExt = supportedOutput.includes(outputExtension);
  const supportedInputExt = supportedInput.includes(fileName.pop());

  if (supportedInputExt && supportedOutputExt) {
    input = input.replace(`.${outputExtension}`, '');
  }

  if (supportedOutputExt) {
    const { source } = req.params;
    const outputQuality = parseInt(query.q || query.quality, 10) || 80;
    return {
      output: {
        width: parseInt(query.w || query.width, 10) || null,
        height: parseInt(query.h || query.height, 10) || null,
        quality: outputQuality <= 0 || outputQuality > 100 ? 80 : outputQuality,
        filter: query.f || query.filter || null,
        extension: outputExtension
      },
      source: source ? source.toUpperCase() : null,
      input: input || null
    };
  }

  throw new Error(`.${outputExtension} files are not supported.`);
};
