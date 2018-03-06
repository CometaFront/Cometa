const url = require('url');
const { Readable } = require('stream');

class HTTP extends Readable {
  constructor(options) {
    super({ objectMode: true });

    this.options = options;
    this.image = {};
    this.isComplete = false;
  }

  _read() {
    if (this.isComplete) {
      return;
    }

    const emitError = error => this.emit('error', { message: error.message });
    try {
      const _url = url.parse(this.options.inputURL);
      const protocol = require.call(null, _url.protocol);
      _url.timeout = this.options.timeout;
      protocol.get(_url, (res) => {
        if (res.statusCode !== 200) {
          emitError({ message: 'The requested image could not be found.' });
        } else {
          let data = [];
          res.setEncoding('binary');
          res.on('data', chunk => data.push(chunk));
          res.on('end', () => {
            data = data.join('');
            this.image.output = this.options.output;
            this.image.body = Buffer.from(data, 'binary');
            this.image.originalSize = data.length;

            setImmediate(() => {
              this.isComplete = true;
              this.push(this.image);
              this.push(null);
              this.image = null;
              data = null;
            });
          });
        }
      }).on('error', emitError);
    } catch (error) {
      emitError(error);
    }
  }
}

module.exports = HTTP;
