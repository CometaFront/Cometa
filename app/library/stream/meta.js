'use strict';


let sharp = require('sharp'),
    mapStream = require('map-stream');

module.exports = () => {

    return mapStream((image, callback) => {

        sharp(image.body).metadata((error, metadata) => {
            if (error) {
                image.error = new Error(error);
            } else {
                image.metadata = metadata;
            }

            callback(null, image);
        });
    });
};
