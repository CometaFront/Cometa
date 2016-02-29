'use strict';


let sharp = require('sharp'),
    mapStream = require('map-stream');

module.exports = () => {

    return mapStream((image, callback) => {

        let sharpImage = sharp(image.body);

        if (image.output.width > 0 || image.output.height > 0) {
            sharpImage.resize(image.output.width, image.output.height).withoutEnlargement();
        }

        /*

         if (image.output.width > 0) {
         if (image.faces) {
         let face = image.faces[0],
         left = (face.x + (face.width / 2)) - (image.output.width / 2),
         top = (face.y + (face.height / 2)) - (image.output.height / 2);

         sharpImage
         .resize(image.metadata.width - 100, image.metadata.height - 100)
         .withoutEnlargement()
         .extract({ left: left, top: top, width: image.output.width, height: image.output.height });
         } else {
         sharpImage.resize(image.output.width, image.output.height).withoutEnlargement();
         }
         }

         */

        sharpImage.quality(image.output.quality).toFormat(image.output.format).toBuffer((error, buffer) => {
            if (error) {
                return callback(new Error(error));
            }

            image.body = buffer;
            callback(null, image);
        });
    });
};
