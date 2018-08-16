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
    this.s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    this.on('end', () => this.emit('provided', 'Image received from S3 provider.'));
  }

  _read() {
    const image = [];
    this.s3
      .getObject({ Bucket: this.aws.bucket, Key: this.input })
      .on('httpHeaders', (status, headers) => {
        this.image.originalSize = headers['content-length'];
      })
      .on('error', (error) => this.emit('error', error))
      .createReadStream()
      .on('data', (chunk) => image.push(chunk))
      .on('end', () => {
        this.image.body = Buffer.concat(image);
        this.image.originalSize = this.image.originalSize || this.image.body.length;
        setImmediate(() => {
          this.push(this.image);
          this.push(null);
          this.image = null;
        });
      });
  }
};
