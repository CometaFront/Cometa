'use strict';


let sharp = require('sharp'),
    mapStream = require('map-stream');

module.exports = function () {

    return mapStream(function (image, callback) {

        sharp(image.body).metadata(function (error, metadata) {
            if (error) {
                image.error = new Error(error);
            } else {
                image.metadata = metadata;
            }

            callback(null, image);
        });
    });
};
