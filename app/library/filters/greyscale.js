'use strict';


let sharp = require('sharp');

module.exports = (image, callback) => {

    sharp(image.body).gamma().greyscale().toBuffer(callback);
};