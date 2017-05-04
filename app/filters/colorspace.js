'use strict';


const sharp = require('sharp');
module.exports = (image, param) => {
    if (['srgb', 'rgb', 'cmyk', 'lab', 'b-w'].indexOf(param) < 0) {
        return image.body;
    }

    return sharp(image.body).toColorspace(param).toBuffer();
};
