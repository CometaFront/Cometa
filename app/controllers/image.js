'use strict';


let stream = require('../library/stream'),
    provider = require('../library/provider');

module.exports = {

    download: (req, res, next) => {

        provider.init(req).on('error', next)
            .pipe(stream.meta())
            .pipe(stream.resize())
            .pipe(stream.response(req, res));
    }
};
