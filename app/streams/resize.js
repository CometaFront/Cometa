'use strict';


const sharp = require('sharp');
const Transform = require('stream').Transform;

module.exports = new Transform({
    objectMode: true,
    transform: async (image, encoding, callback) => {

        const sharpImage = sharp(image.body);
        if (image.output.width > 0 || image.output.height > 0) {
            sharpImage.resize(image.output.width, image.output.height).withoutEnlargement();
        }

        try {
            image.body = await sharpImage.toBuffer();
            callback(null, image);
        } catch (error) {
            console.log('b');
            callback(error);
        }
    }
});
