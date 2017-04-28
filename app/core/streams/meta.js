'use strict';


const sharp = require('sharp');
const Transform = require('stream').Transform;

module.exports = next => new Transform({
    objectMode: true,
    transform: (image, encoding, callback) => {

        try {
            setImmediate(async () => {
                image.metadata = await sharp(image.body).metadata();
                callback(null, image);
            });
        } catch (error) {
            callback(error);
        }
    }
}).once('error', next);
