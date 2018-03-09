const aws = require('aws-sdk');
const { Readable } = require('stream');

class S3 extends Readable {
  constructor(config = {}) {
    super({ objectMode: true });

    this.image = {};
    this.bucket = config.bucket;
    this.isComplete = false;

    aws.config = config;
    this.S3 = new aws.S3();
  }

  _read() {
    if (this.isComplete) {
      return;
    }

    this.S3.getObject({ Bucket: this.bucket, Key: this.options.input }, (error, data) => {
      console.log('SLOW');
      if (error) {
        this.emit('error', error);
      } else {
        this.image.output = this.options.output;
        this.image.body = data.Body;
        this.image.originalSize = data.Body.length;

        this.isComplete = true;
        this.push(this.image);
        this.push(null);
        this.image = null;
      }
    });
  }
}

module.exports = S3;
