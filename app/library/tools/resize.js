'use strict';


let sharp = require('sharp'),
    mapStream = require('map-stream');

module.exports = function () {

    return mapStream(function (image, callback) {

        let sharpImage = sharp(image.body);

        if (image.output.width > 0) {
            sharpImage.resize(image.output.width, image.output.height).withoutEnlargement();
        }

        sharpImage.quality(image.output.quality).toFormat(image.output.format).toBuffer(function (error, buffer) {
            if (error) {
                image.error = new Error(error);
            } else {
                image.body = buffer;
            }

            callback(null, image);
        });
    });
};
