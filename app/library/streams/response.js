'use strict';


let crypto = require('crypto'),
    stream = require('stream'),
    Response = function Response(req, res) {
        if (!(this instanceof Response)) {
            return new Response(req, res);
        }

        stream.Writable.call(this, { objectMode: true });
        this.req = req;
        this.res = res;
    };

Response.prototype._write = function Response$write(image) {

    let expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    this.res.set({
        'Content-Type': 'image/' + image.output.format,
        'Cache-Control': 'max-age=2592000,public',
        'Expires': expirationDate.toGMTString(),
        'Content-Length': image.body.length,
        'Last-Modified': (new Date()).toGMTString(),
        'Etag': crypto.createHash('sha1').update(image.body, 'utf8').digest('hex'),
        'Vary': 'Accept-Encoding'
    });
    this.res.send(image.body);
    this.end();

    image = null;
};

require('util').inherits(Response, stream.Writable);
module.exports = Response;
