'use strict';


let express = require('express'),
    favicon = require('serve-favicon'),
    route = require('./library/route'),
    cluster = require('./library/cluster'),
    app = express();

app.use(
    (req, res, next) => {
        res.set('X-Powered-By', 'ibrag.it');
        return next();
    },
    favicon(__dirname + '/public/favicon.png'),
    route(express.Router()),
    (error, req, res, next) => {
        res.status(error.status || 404).end();
        next = null;
    }
);

cluster(app, process.env.PORT);
