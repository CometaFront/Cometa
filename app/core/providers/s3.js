'use strict';


const config = _require('config');
const aws = require('aws-sdk');
class S3 extends require('stream').Readable {

    constructor (options) {

        super({ objectMode: true });

        this.options = options;
        this.image = {};
        this.isComplete = false;

        aws.config = config.aws;
        this.S3 = new aws.S3();
    }

    _read () {
        if (this.isComplete) {
            return;
        }

        this.S3.getObject({ Bucket: config.aws.bucket, Key: this.options.inputURL }, (error, data) => {
            if (error) {
                return this.emit('error', { message: 'The requested image could not be found.' });
            }

            this.image.output = this.options.output;
            this.image.body = data.Body;
            this.image.originalSize = data.Body.length;

            setImmediate(() => {
                this.isComplete = true;
                this.push(this.image);
                this.push(null);
                this.image = null;
            });
        });
    }
}

module.exports = S3;
