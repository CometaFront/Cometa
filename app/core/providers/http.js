'use strict';


const http = require('http');
class HTTP extends require('stream').Readable {
    constructor (params) {

        super({ objectMode: true });
        this.imageURL = params.inputURL;
        this.output = params.output;
        this.res = params.res;
        this.image = {};
        this.isComplete = false;
    }

    _read () {
        if (this.isComplete) {
            return;
        }

        http.get(this.imageURL, res => {
            if (res.statusCode !== 200) {
                return this.emit('error', {
                    status: 400,
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
    }
}

module.exports = HTTP;
