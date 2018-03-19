const sharp = require('sharp')
module.exports = (image, param) => {
  if (!['srgb', 'rgb', 'cmyk', 'lab', 'b-w'].includes(param)) {
    return image.body
  }

  return sharp(image.body)
    .toColorspace(param)
    .toBuffer()
}
