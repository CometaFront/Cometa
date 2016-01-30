'use strict';


var crypto = require('crypto'),
    config = require('../config');

module.exports = {

    hmac : function cryptoHelper$hmac(data, hash, encoding, key) {

        hash = hash || 'RSA-SHA512';
        encoding = encoding || 'base64';
        key = key || config.keys.api;

        return crypto.createHmac(hash, key).update(data).digest(encoding);
    },

    hash : function cryptoHelper$hash(data, hash, encoding) {

        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }

        hash = hash || 'RSA-SHA512';
        encoding = encoding || 'base64';

        return crypto.createHash(hash).update(data, 'utf8').digest(encoding);
    }

};
