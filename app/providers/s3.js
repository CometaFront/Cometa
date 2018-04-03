// Modules
const aws = require('aws-sdk');
const { Readable } = require('stream');

class S3 extends Readable {
  constructor(config = null) {
    super({ objectMode: true });
    if (!config) {
      throw new Error('Configuration is required.');
    }

    this.config = config;
    this.image = { output: config.output };
    this.isComplete = false;

    aws.config = this.config.s3;
    this.S3 = new aws.S3();

    this.on('end', () => {
      this.image = null;
    });
  }

  _read() {
    if (this.isComplete) {
      return;
    }

    this.S3.getObject({ Bucket: this.config.bucket, Key: this.config.input }, (error, data) => {
      if (error) {
        return this.emit('error', error);
      }

      this.image.body = data.Body;
      this.image.originalSize = data.Body.length;

      this.isComplete = true;
      this.push(this.image);
      this.push(null);
      this.image = null;

      return true;
    });
  }
}

module.exports = S3;
