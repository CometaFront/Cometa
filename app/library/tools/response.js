'use strict';


let util = require('util'),
    stream = require('stream'),
    crypto = require('../crypto'),
    Response = function Response(req, res) {
        if (!(this instanceof Response)) {
            return new Response(req, res);
        }

        stream.Writable.call(this, { objectMode: true });
        this.req = req;
        this.res = res;
    };

Response.prototype._write = function (image) {

    this.res.set({
        'Content-Type': 'image/' + image.output.format,
        'Cache-Control': 'public, max-age=2592000, no-transform',
        'Content-Length': image.body.length,
        'Last-Modified': (new Date()).toGMTString(),
        'Etag': crypto.hash(image.body, 'md5', 'hex'),
        'Vary': 'Accept-Encoding'
    });
    this.res.end(image.body);
    this.end();
};

util.inherits(Response, stream.Writable);
module.exports = Response;
