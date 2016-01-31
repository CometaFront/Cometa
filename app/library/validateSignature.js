'use strict';


var config = require('../config/index'),
    crypto = require('./crypto'),
    querystring = require('querystring');

module.exports = function validateSignature(req, res, next) {

    if (req.params.signature === 'noauth') {
        return next();
    }

    let url = '/' + req.params[0] + '?' + querystring.stringify(req.query),
        serverSignature = crypto.hmac(req.get('Host') + url, 'sha1', 'hex', config.key);

    if (serverSignature === req.params.signature) {
        return next();
    }

    next({ code: 403 });
};
