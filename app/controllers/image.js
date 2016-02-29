'use strict';


let parse = require('../library/parse'),
    stream = require('../library/stream');

module.exports = {

    download: (req, res) => {

        new stream.S3(parse(req))
            .pipe(stream.meta())
            .pipe(stream.resize())
            .pipe(stream.response(req, res));
    }
};
