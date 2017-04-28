'use strict';


const parse = _require('library/parse');
const S3 = _require('../providers/s3');
const HTTP = _require('../providers/http');

module.exports = {

    load: req => {

        try {
            const params = parse(req);
            switch (params.provider) {
                case 'S3': return S3(params);
                case 'http': return new HTTP(params);
            }
        } catch (error) {
            throw error;
        }
    }
};
