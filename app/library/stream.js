'use strict';


let meta = require('./streams/meta'),
    resize = require('./streams/resize'),
    response = require('./streams/response');

module.exports = {

    meta: meta,
    resize: resize,
    response: response
};
