// Modules
const path = require('path');

const supportedInput = ['webp', 'png', 'tiff', 'jpeg', 'jpg'];
const supportedOutput = ['webp', 'png', 'tiff', 'jpeg'];

module.exports = (req) => {
  let input = req.path;
  const { query } = req;

  const fileName = path.basename(input).split('.');
  let firstExtension = fileName.pop();
  const secondExtension = fileName.pop();

  if (supportedInput.includes(firstExtension)) {
    const removedExtension = firstExtension;
    firstExtension = !supportedOutput.includes(firstExtension) ? 'jpeg' : firstExtension;
    input = supportedInput.includes(secondExtension) ? input.replace(`.${removedExtension}`, '') : input;
  } else if (!supportedInput.includes(firstExtension)) {
    throw new Error(`.${firstExtension} files are not supported.`);
  }

  const { source } = req.params;
  const outputQuality = parseInt(query.q || query.quality, 10);
  return {
    output: {
      width: parseInt(query.w || query.width, 10),
      height: parseInt(query.h || query.height, 10),
      quality: outputQuality > 0 && outputQuality <= 100 ? outputQuality : 80,
      filter: query.f || query.filter || null,
      extension: firstExtension
    },
    source: source ? source.toUpperCase() : null,
    input: input || null
  };
};
