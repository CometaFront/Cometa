'use strict';


let express = require('express'),
    favicon = require('serve-favicon'),
    router = require('./library/router'),
    cluster = require('./library/cluster'),
    app = express();

app.use(
    (req, res, next) => {
        res.set('x-powered-by', 'ibrag.it');
        return next();
    },
    favicon(__dirname + '/public/favicon.png'),
    router(express),
    (error, req, res, next) => {
        res.status(error.status || 404).end();
        next = null;
    }
);

cluster(app, process.env.PORT);
