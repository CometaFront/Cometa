'use strict';


let S3 = require('./s3'),
    HTTP = require('./http');

module.exports = {

    init: params => {
        switch (params.provider) {
            case 'S3': return new S3(params);
                break;

            case 'http': return new HTTP(params);
                break;
        }
    }
};
