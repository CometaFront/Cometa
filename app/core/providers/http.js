const url = require('url');
const { Readable } = require('stream');

class HTTP extends Readable {
  constructor(config = {}) {
    super({ objectMode: true });

    this.requestTimeout = config.requestTimeout;
    this.image = {};
    this.isComplete = false;
  }

  _read() {
    if (this.isComplete) {
      console.log('Complete');
      return;
    }

    const emitError = error => this.emit('error', error);
    try {
      const _url = url.parse(this.options.input);
      console.log('AAA');
      const protocol = require.call(null, _url.protocol.replace(':', ''));
      _url.timeout = this.requestTimeout;
      protocol.get(_url, (res) => {
        if (res.statusCode !== 200) {
          console.log('sss');
          emitError(new Error('The requested image could not be found.'));
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
      console.log(error);
      emitError(error);
    }
  }
}

module.exports = HTTP;
