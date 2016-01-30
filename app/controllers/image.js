'use strict';


let S3 = require('../library/tools/s3'),
    resize = require('../library/tools/resize'),
    metadata = require('../library/tools/metadata'),
    response = require('../library/tools/response');

module.exports = {

    download: function image$download(req, res) {

        new S3(req)
            .pipe(metadata())
            .pipe(resize())
            .pipe(response(req, res));
    }
};
