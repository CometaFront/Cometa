const { parse } = require('url');
const { Readable } = require('stream');

module.exports = class URL extends Readable {
  constructor(config = null) {
    super({ objectMode: true });
    if (!config) {
      throw new Error('Configuration is required.');
    }

    this.inputUrl = parse(config.input);
    this.inputUrl.timeout = config.requestTimeout;
    this.image = { output: config.output };
    this.on('end', () => this.emit('provided', 'Image received from URL provider.'));
  }

  _read() {
    const protocol = /https/.test(this.inputUrl.protocol) ? 'https' : 'http';
    require.call(null, protocol).get(this.inputUrl, (res) => {
      if (res.statusCode !== 200) {
        return this.emit('error', new Error('The requested image could not be found.'));
      }

      const image = [];
      return res.on('data', (chunk) => image.push(chunk)).on('end', () => {
        this.image.body = Buffer.concat(image);
        this.image.originalSize = res.headers['content-length'] || this.image.body.length;

        setImmediate(() => {
          this.isComplete = true;
          this.push(this.image);
          this.push(null);
        });
      });
    });
  }
};
