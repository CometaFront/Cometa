'use strict';


let express = require('express'),
    router = require('./library/router'),
    favicon = require('serve-favicon'),
    app = express();

require('./dump.js').init(__dirname);

app.use(
    (req, res, next) => {
        res.set('X-Powered-By', 'analogbird.com');
        return next();
    },
    favicon(__dirname + '/public/favicon.png'),
    router(express),
    (error, req, res, next) => {
        res.status(error.code || 404).end();
        next = null;
    }
);

app.listen(process.env.PORT, () => {
    console.log('Up on port:', process.env.PORT);
});
