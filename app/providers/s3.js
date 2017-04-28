'use strict';


const aws = require('aws-sdk');
const stream = require('stream');
const config = _require('config');
const S3 = function (params) {
    if (!(this instanceof S3)) {
        return new S3(params);
    }

    stream.Readable.call(this, { objectMode: true });

    this.imageKey = params.inputURL;
    this.output = params.output;
    this.image = {};
    this.isComplete = false;
};

aws.config = config.aws;
S3.prototype._read = function () {
    if (this.isComplete) {
        this.image = null;
        return;
    }

    const s3 = new aws.S3();
    const params = {
        Bucket: config.aws.bucket,
        Key: this.imageKey
    };

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
        this.image = null;
    });
};

require('util').inherits(S3, stream.Readable);
module.exports = S3;
