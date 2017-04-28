'use strict';


const provider = _require('library/provider');
const stream = _require('library/stream');

module.exports = {

    download: (req, res, next) => {

        try {
            provider.load(req)
                .pipe(stream.meta)
                .pipe(stream.resize)
                //.pipe(stream.filter)
                .pipe(stream.response(res));
        } catch (error) {
            return next(error);
        }
    }
};
