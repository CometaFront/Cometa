const AWS = require('aws-sdk');
const { Readable } = require('stream');

module.exports = class S3 extends Readable {
  constructor(config = null) {
    super({ objectMode: true });
    if (!config) {
      throw new Error('Configuration is required.');
    }

    ({ aws: this.aws, input: this.input } = config);
    this.image = { output: config.output };

    AWS.config = this.aws;
    this.S3 = new AWS.S3({ apiVersion: '2006-03-01' });
    this.on('end', () => this.emit('provided', 'Image received from S3 provider.'));
  }

  // eslint-disable-next-line no-underscore-dangle
  _read() {
    this.S3.getObject({ Bucket: this.aws.bucket, Key: this.input }, (error, data) => {
      if (error) {
        return this.emit('error', error);
      }

      this.image.body = data.Body;
      this.image.originalSize = data.Body.length;

      this.push(this.image);
      this.push(null);
      return true;
    });
  }
};
