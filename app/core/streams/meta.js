'use strict';


const sharp = require('sharp');
const Transform = require('stream').Transform;

module.exports = new Transform({
    objectMode: true,
    transform: async (image, encoding, callback) => {

        try {
            image.metadata = await sharp(image.body).metadata();
            callback(null, image);
        } catch (error) {
            console.log('a');
            callback(error);
        }
    }
});
