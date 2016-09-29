'use strict';


const stream = _require('library/stream');
const provider = _require('library/provider');

module.exports = {

    download: (req, res, next) => {

        provider.init(req).on('error', next)
            .pipe(stream.meta()).on('error', next)
            .pipe(stream.resize()).on('error', next)
            .pipe(stream.filter()).on('error', next)
            .pipe(stream.response(req, res));
    }
};
