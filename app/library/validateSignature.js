'use strict';


var config = require('../config/index'),
    crypto = require('crypto');

module.exports = function validateSignature(req, res, next) {

    if (req.params.signature === 'noauth') {
        return next();
    }

    let url = req.url.replace(/^\/+|\/+$/gi, ''),
        signature = url.substr(0, url.indexOf('/')),
        payload = url.replace(signature, ''),
        serverSignature = crypto.hmac(payload, 'sha1', 'hex', config.key);

    if (serverSignature === signature) {
        return next();
    }

    next({ code: '403.10' });
};
