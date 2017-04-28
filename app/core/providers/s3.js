'use strict';


const config = _require('config');
const aws = require('aws-sdk');
class S3 extends require('stream').Readable {
    constructor (params) {

        aws.config = config.aws;

        super({ objectMode: true });
        this.imageKey = params.inputURL;
        this.output = params.output;
        this.res = params.res;
        this.image = {};
        this.isComplete = false;
    }

    _read () {
        if (this.isComplete) {
            return;
        }

        const s3 = new aws.S3();
        const params = {
            Bucket: config.aws.bucket,
            Key: this.imageKey
        };

        s3.getObject(params, (error, data) => {
            if (error) {
                return this.emit('error', {
                    status: 400,
                    forwardStatus: error.statusCode,
                    message: 'The requested image could not be found.'
                });
            } else {
                this.image.output = this.output;
                this.image.body = data.Body;
                this.image.originalSize = data.Body.length;
            }

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
