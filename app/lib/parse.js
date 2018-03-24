// Modules
const path = require('path');

const supportedInput = ['webp', 'png', 'tiff', 'jpeg', 'jpg'];
const supportedOutput = ['webp', 'png', 'tiff', 'jpeg', 'jpg'];

const output = (data = {}) => {
  const {
    query,
    input,
    provider,
    extension
  } = data;
  const outputQuality = parseInt(query.q || query.quality, 10) || 80;

  return {
    output: {
      width: parseInt(query.w || query.width, 10) || null,
      height: parseInt(query.h || query.height, 10) || null,
      quality: outputQuality <= 0 || outputQuality > 100 ? 80 : outputQuality,
      extension
    },
    provider,
    input
  };
};

module.exports = (req) => {
  const { query } = req;
  const fileName = path.basename(req.path).split('.');
  const outputExtension = fileName.pop();
  const supportedOutputExt = supportedOutput.includes(outputExtension);
  const supportedInputExt = supportedInput.includes(fileName.pop());

  let input = null;
  if (supportedInputExt && supportedOutputExt) {
    input = req.path.replace(`.${outputExtension}`, '');
  }

  if (supportedOutputExt) {
    const { provider } = req.params;
    return output({
      query,
      input,
      provider: provider ? provider.toUpperCase() : null,
      extension: outputExtension
    });
  }

  throw new Error(`.${outputExtension} files are not supported.`);
};
