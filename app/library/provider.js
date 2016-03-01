'use strict';


let parse = require('./parse'),
    S3 = require('./providers/s3'),
    HTTP = require('./providers/http');

module.exports = {

    init: req => {

        let params = parse(req);
        switch (params.provider) {
            case 'S3': return new S3(params);
                break;

            case 'http': return new HTTP(params);
                break;
        }
    }
};
