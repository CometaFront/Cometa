'use strict';


let aws = require('aws-sdk'),
    stream = require('stream'),
    config = require('../../config'),
    S3 = function S3(params) {
        if (!(this instanceof S3)) {
            return new S3(params);
        }

        stream.Readable.call(this, { objectMode: true });

        this.imageKey = params.imagePath;
        this.output = params.output;
        this.image = {};
        this.isComplete = false;
    };

aws.config = config.aws;
S3.prototype._read = function S3$read() {
    if (this.isComplete) {
        this.image = null;
        return;
    }

    let s3 = new aws.S3(),
        params = { Bucket: config.aws.bucket, Key: this.imageKey };

    s3.getObject(params, (error, data) => {
        if (error) {
            console.error(`Provider error: ${error}`);
            this.emit('error', new Error({ status: 404 }));
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

require('util').inherits(S3, stream.Readable);
module.exports = S3;
