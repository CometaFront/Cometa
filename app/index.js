'use strict';


let express = require('express'),
    router = require('./library/router'),
    cluster = require('./library/cluster'),
    favicon = require('serve-favicon'),
    app = express();

app.use(
    (req, res, next) => {
        res.set('x-powered-by', 'ibrag.it');
        return next();
    },
    favicon(__dirname + '/public/favicon.png'),
    router(express),
    (error, req, res, next) => {
        res.status(error.code || 404).end();
        next = null;
    }
);

cluster(app, process.env.PORT);
