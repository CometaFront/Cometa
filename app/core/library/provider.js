'use strict';


const parse = _require('library/parse');
const S3 = _require('providers/s3');
const HTTP = _require('providers/http');
const timeout = _require('config').requestTimeout;

module.exports = (req, next) => {

    const options = parse(req);
    options.timeout = timeout;

    switch (options.provider) {
        case 'S3': return new S3(options).once('error', next);
        case 'HTTP': return new HTTP(options).once('error', next);
    }
};
