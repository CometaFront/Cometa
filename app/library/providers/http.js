'use strict';


const stream = require('stream');
const config = _require('config');
const request = require('request').defaults({ encoding: null });
const HTTP = function (params) {
    if (!(this instanceof HTTP)) {
        return new HTTP(params);
    }

    stream.Readable.call(this, { objectMode: true });

    this.imageURL = params.inputURL;
    this.output = params.output;
    this.image = {};
    this.isComplete = false;
};

HTTP.prototype._read = function () {
    if (this.isComplete) {
        this.image = null;
        return;
    }

    request(
        {
            method: 'GET',
            url: this.imageURL,
            timeout: config.requestTimeout
        }, (error, res, body) => {
            if (error || res.statusCode >= 400) {
                console.error(`Provider error: ${error.code}`);
                this.emit('error', new Error({ status: res ? res.statusCode : 404 }));
            } else {
                this.image.output = this.output;
                this.image.body = body;
                this.image.originalBodyLength = body.length;
            }

            this.isComplete = true;
            this.push(this.image);
            this.push(null);
            this.image = null;
        });
};

require('util').inherits(HTTP, stream.Readable);
module.exports = HTTP;
