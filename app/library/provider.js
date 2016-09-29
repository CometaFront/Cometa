'use strict';


const parse = _require('library/parse');
const S3 = _require('library/providers/s3');
const HTTP = _require('library/providers/http');

module.exports = {

    init: req => {

        const params = parse(req);
        switch (params.provider) {
            case 'S3': return new S3(params);
                break;

            case 'http': return new HTTP(params);
                break;
        }
    }
};
