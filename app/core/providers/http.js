'use strict';


const http = require('http');
const https = require('https');
const url = require('url');
class HTTP extends require('stream').Readable {
    constructor (params, timeout) {

        super({ objectMode: true });
        this.imageURL = params.inputURL;
        this.output = params.output;
        this.timeout = timeout;
        this.res = params.res;
        this.image = {};
        this.isComplete = false;
    }

    _read () {
        if (this.isComplete) {
            return;
        }

        try {
            const _url = url.parse(this.imageURL);
            _url.timeout = this.timeout;
            (_url.protocol === 'https:' ? https : http).get(_url, res => {
                if (res.statusCode !== 200) {
                    return this.emit('error', {
                        forwardStatus: res.statusCode,
                        message: 'The requested image could not be found.'
                    });
                }

                let data = [];
                res.setEncoding('binary');
                res.on('data', chunk => data.push(chunk));
                res.on('end', () => {
                    data = data.join('');
                    this.image.output = this.output;
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
            });
        } catch (error) {
            return this.emit('error', { message: error.message });
        }
    }
}

module.exports = HTTP;
