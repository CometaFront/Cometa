'use strict';


let sharp = require('sharp'),
    mapStream = require('map-stream');

module.exports = () => {

    return mapStream((image, callback) => {

        sharp(image.body).metadata((error, metadata) => {
            if (error) {
                return callback(new Error(error));
            }

            image.metadata = metadata;
            callback(null, image);
        });
    });
};
