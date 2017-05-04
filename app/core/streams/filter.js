'use strict';


const path = require('path');
const Transform = require('stream').Transform;
const filterImage = (image, filters) => {

    filters = filters.replace(/[^0-9a-z:,-]/gi, '').split(/[,]+/);
    const fn = async (yes, no) => {
        let filter = filters.shift();
        if (filter) {
            try {
                let [name, param = null] = filter.split(/[:]+/);
                name = name.trim();
                let filterModule = require(path.resolve(`${__dirname}/../../filters/${name}`));
                image.body = await filterModule(image, param);
                image.filters.push({ filter: name, error: null });
                return fn(yes, no);
            } catch (error) {
                if (error.message.indexOf('Cannot find module') >= 0) {
                    image.filters.push({ filter: name, error: error.message });
                    return fn(yes, no);
                } else {
                    no(error);
                }
            }
        }

        yes(image);
    };

    return new Promise((yes, no) => fn(yes, no));
};

module.exports = next => new Transform({
    objectMode: true,
    transform: async (image, encoding, callback) => {

        if (!image.output.filter) {
            return callback(null, image);
        }

        try {
            image.filters = []; // Only to collect meta data on applied filters.
            image = await filterImage(image, image.output.filter);
            callback(null, image);
        } catch (error) {
            console.error(`Filter process error: ${error.message}`);
            callback(null, image);
        }
    }
}).once('error', next);
