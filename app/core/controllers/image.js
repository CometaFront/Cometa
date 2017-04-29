'use strict';


const provider = _require('library/provider');
const streams = _require('library/streams');

module.exports = {

    download: (req, res, next) => {

        try {
            provider.load(req)
                .pipe(streams.meta)
                .pipe(streams.resize)
                //.pipe(stream.filter)
                .pipe(streams.response(res));
        } catch (error) {
            return next(error);
        }
    }
};
