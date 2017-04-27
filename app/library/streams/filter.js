'use strict';


const fs = require('fs');
const mapStream = require('map-stream');
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

module.exports = () => {

    return mapStream((image, callback) => {

        if (filters.hasOwnProperty(image.output.filter)) {
            filters[image.output.filter](image, (error, buffer) => {
                if (error) {
                    return callback(new Error(error));
                }

                image.body = buffer;
                callback(null, image);
            });
        } else {
            callback(null, image);
        }
    });
};
