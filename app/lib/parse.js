// Modules
const path = require('path');

const supportedInput = ['webp', 'png', 'tiff', 'jpeg', 'jpg'];
const supportedOutput = ['webp', 'png', 'tiff', 'jpeg', 'jpg'];

const output = (data = {}) => {
  const { query } = data;
  const outputQuality = parseInt(query.q, 10) || 80;
  const validQuality = outputQuality * (outputQuality - 101) < 0;

  return {
    output: {
      width: parseInt(query.w, 10) || null,
      height: parseInt(query.h, 10) || null,
      quality: validQuality ? outputQuality : 80,
      extension: data.extension
    },
    provider: data.provider,
    input: data.input
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
