'use strict';


const fs = require('fs');
const Transform = require('stream').Transform;
const filters = (() => {

    const filters = {};
    const filterPath = `${__dirname}/../filters/`;

    fs.readdirSync(filterPath).forEach(filter => {
        if (filter.match(/(.+)\.js$/)) {
            const filterName = filter.replace('.js', '');
            filters[filterName] = require(`${filterPath}/${filterName}`);
        }
    });

    return filters;
})();

module.exports = new Transform({
    objectMode: true,
    transform: (image, enc, cb) => {

        if (filters.hasOwnProperty(image.output.filter)) {
            filters[image.output.filter](image, (error, buffer) => {
                if (error) {
                    return cb(new Error(error));
                }

                image.body = buffer;
                cb(null, image);
            });
        } else {
            cb(null, image);
        }
    }
});
