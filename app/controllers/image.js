'use strict';


let parse = require('../library/parse'),
    stream = require('../library/stream'),
    provider = require('../library/providers');

module.exports = {

    download: (req, res) => {

        provider.init(parse(req))
            .pipe(stream.meta())
            .pipe(stream.resize())
            .pipe(stream.response(req, res));
    }
};
