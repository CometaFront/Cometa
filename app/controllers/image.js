'use strict';


let stream = require('../library/streams'),
    provider = require('../library/providers');

module.exports = {

    download: (req, res, next) => {

        provider.init(req).on('error', next)
            .pipe(stream.meta()).on('error', next)
            .pipe(stream.resize()).on('error', next)
            .pipe(stream.response(req, res));
    }
};
