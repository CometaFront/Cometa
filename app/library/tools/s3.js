'use strict';


let util = require('util'),
    aws = require('aws-sdk'),
    stream = require('stream'),
    parse = require('../parse'),
    config = require('../../config'),
    S3 = function S3(req) {
        if (!(this instanceof S3)) {
            return new S3(req);
        }

        stream.Readable.call(this, { objectMode: true });

        let params = parse(req);
        this.imageKey = params.imagePath;
        this.output = params.output;
        this.image = {};
        this.isComplete = false;
    };

aws.config = config.aws;
S3.prototype._read = function S3$read() {
    if (this.isComplete) {
        return;
    }

    let s3 = new aws.S3(),
        params = { Bucket: config.aws.bucket, Key: this.imageKey };

    s3.getObject(params, (error, data) => {
        if (error) {
            this.image.error = error;
        } else {
            this.image.output = this.output;
            this.image.body = data.Body;
            this.image.originalBodyLength = data.Body.length;
        }

        this.isComplete = true;
        this.push(this.image);
        this.push(null);
        this.image = null;
    });
};

util.inherits(S3, stream.Readable);
module.exports = S3;
