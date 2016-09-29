'use strict';


global._require = module => require(`${__dirname}/${module}`);
const express = require('express');
const cluster = _require('library/cluster');
const app = express();

app.use(
    (req, res, next) => {
        res.set('X-Powered-By', 'analogbird.com');
        return next();
    },
    require('serve-favicon')(__dirname + '/public/favicon.png'),
    _require('router')(express),
    (error, req, res, next) => {
        res.status(error.status || 404).end();
        next = null;
    }
);

cluster(app, process.env.PORT);
