const url = require('url');
const { Readable } = require('stream');

class URL extends Readable {
  constructor(config = {}) {
    super({ objectMode: true });

    this.config = config;
    this.image = {};
    this.isComplete = false;

    this.on('end', () => {
      this.image = null;
    });
  }

  _read() {
    if (this.isComplete) {
      return;
    }

    try {
      const _url = url.parse(this.config.input);
      const protocol = require.call(null, _url.protocol.replace(':', ''));
      _url.timeout = this.config.requestTimeout;

      protocol.get(_url, (res) => {
        if (res.statusCode !== 200) {
          this.emit('error', new Error('The requested image could not be found.'));
        } else {
          let data = [];
          res.setEncoding('binary');
          res.on('data', chunk => data.push(chunk));
          res.on('end', () => {
            data = data.join('');
            this.image.output = this.config.output;
            this.image.body = Buffer.from(data, 'binary');
            this.image.originalSize = data.length;

            setImmediate(() => {
              this.isComplete = true;
              this.push(this.image);
              this.push(null);
            });
          });
        }
      }).on('error', error => this.emit('error', error));
    } catch (error) {
      this.emit('error', error);
    }
  }
}

module.exports = URL;
