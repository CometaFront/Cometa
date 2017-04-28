'use strict';


const parse = _require('library/parse');
const S3 = _require('providers/s3');
const HTTP = _require('providers/http');

module.exports = (req, next) => {

    const params = parse(req);
    switch (params.provider) {
        case 'S3': return new S3(params).once('error', next);
        case 'HTTP': return new HTTP(params).once('error', next);
    }
};
