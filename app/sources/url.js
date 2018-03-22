// Modules
const url = require('url');
const { Readable, PassThrough } = require('stream');
const { meta } = attract('lib/streams');

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

    const inputUrl = url.parse(this.config.input);
    const protocol = require.call(null, inputUrl.protocol.replace(':', ''));
    inputUrl.timeout = this.config.requestTimeout;

    protocol.get(inputUrl, (res) => {
      const bufferStream = new PassThrough({ objectMode: true });
      res.pipe(meta()).pipe(bufferStream);
      bufferStream.on('data', (response) => {
        this.image.metadata = response.metadata;
        this.image.output = this.config.output;
        this.image.body = Buffer.from(response.image, 'binary');
        this.image.originalSize = response.image.length;

        console.log(this.image.body.length);
      });
      bufferStream.on('end', () => {
        console.log('END');
      });

      bufferStream.on('error', () => {
        console.log('ERROR');
      });
    });


    /*protocol.get(inputUrl, (res) => {
      if (res.statusCode !== 200) {
        return this.emit('error', new Error('The requested image could not be found.'));
      }

      let data = [];
      res.setEncoding('binary');
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        data = data.join('');
        this.image.output = this.config.output;
        this.image.body = Buffer.from(data, 'binary');
        this.image.originalSize = data.length;

        console.log(this.image.body.length);
        // console.log(this.image.body.toString('hex'));
        setImmediate(() => {
          console.log('passs');
          this.isComplete = true;
          this.push(this.image);
          this.push(null);
        });
      });

      return true;
    }).on('error', this.emit.bind(null, 'error'));*/
  }
}

module.exports = URL;
