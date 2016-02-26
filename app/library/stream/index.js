'use strict';


let S3 = require('./s3'),
    meta = require('./meta'),
    resize = require('./resize'),
    response = require('./response');

module.exports = {

    S3: S3,
    meta: meta,
    resize: resize,
    response: response
};
