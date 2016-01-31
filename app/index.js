'use strict';


let express = require('express'),
    router = require('./library/router'),
    favicon = require('serve-favicon'),
    app = express();

app.use(
    function setHeaders(req, res, next) {
        res.set('X-Powered-By', 'analogbird.com');
        return next();
    },
    favicon(__dirname + '/public/favicon.png'),
    router(express),
    function errorHandler(error, req, res, next) {
        res.status(error.code || 404).end();
        next = null;
    }
);

app.listen(process.env.PORT, function () {
    console.log('Up on port:', process.env.PORT);
});
