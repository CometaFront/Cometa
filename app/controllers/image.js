'use strict';


let filter = require('../library/filter'),
    stream = require('../library/stream'),
    provider = require('../library/provider');

module.exports = {

    download: (req, res, next) => {

        provider.init(req).on('error', next)
            .pipe(stream.meta()).on('error', next)
            .pipe(stream.resize()).on('error', next)
            .pipe(filter()).on('error', next)
            .pipe(stream.response(req, res));
    }
};
