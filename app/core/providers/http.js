'use strict';


const http = require('http');
const https = require('https');
const url = require('url');
class HTTP extends require('stream').Readable {

    constructor (options) {

        super({ objectMode: true });

        this.options = options;
        this.image = {};
        this.isComplete = false;
    }

    _read () {
        if (this.isComplete) {
            return;
        }

        const emitError = error => this.emit('error', { message: error.message });
        try {
            const _url = url.parse(this.options.inputURL);
            _url.timeout = this.options.timeout;
            (_url.protocol === 'https:' ? https : http).get(_url, res => {
                if (res.statusCode !== 200) {
                    return emitError({ message: 'The requested image could not be found.' });
                }

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
            }).on('error', emitError);
        } catch (error) {
            return emitError(error);
        }
    }
}

module.exports = HTTP;
