'use strict';


let stream = require('../library/stream'),
    parse = require('../library/parse');

module.exports = {

    download: (req, res) => {

        let params = parse(req);
        new stream.S3(params)
            .pipe(stream.meta())
            .pipe(stream.resize())
            .pipe(stream.response(req, res));
    }
};
