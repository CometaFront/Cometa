'use strict';


let stream = require('../library/stream'),
    parse = require('../library/parse');

module.exports = {

    download: (req, res) => {

        new stream.S3(parse(req))
            .pipe(stream.meta())
            .pipe(stream.resize())
            .pipe(stream.response(req, res));
    }
};
