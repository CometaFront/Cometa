// Modules
const path = require('path');

const supportedInput = ['webp', 'png', 'tiff', 'jpeg', 'jpg'];
const supportedOutput = ['webp', 'png', 'tiff', 'jpeg'];

module.exports = req => new Promise((yes, no) => {
  const outputQuality = parseInt(req.query.q || req.query.quality, 10);
  let input = req.path;

  const fileName = path.basename(input).split('.');
  let firstExtension = fileName.pop();
  const secondExtension = fileName.pop();

  if (supportedInput.includes(firstExtension)) {
    const removedExtension = firstExtension;
    firstExtension = !supportedOutput.includes(firstExtension) ? 'jpeg' : firstExtension;
    input = supportedInput.includes(secondExtension) ? input.replace(`.${removedExtension}`, '') : input;
  } else if (!supportedInput.includes(firstExtension)) {
    return no(new Error(`I can't deal with .${firstExtension} files.`));
  }

  return yes({
    output: {
      width: parseInt(req.query.w || req.query.width, 10) || null,
      height: parseInt(req.query.h || req.query.height, 10) || null,
      filter: req.query.f || req.query.filter || null,
      quality: outputQuality > 0 && outputQuality <= 100 ? outputQuality : 80,
      extension: firstExtension
    },
    source: req.params.source ? req.params.source.toUpperCase() : null,
    input: input || null
  });
});
