'use strict';


const provider = _require('library/provider');
const stream = _require('library/streams');

module.exports = {

    download: (req, res, next) => {

        provider(req, next)
            .pipe(stream.meta(next))
            .pipe(stream.resize(next))
            .pipe(stream.filter(next))
            .pipe(stream.response(res, next));
    }
};
