'use strict';


const sharp = require('sharp');
module.exports = image => sharp(image.body).gamma().greyscale().toBuffer();
