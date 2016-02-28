'use strict';


let cluster = require('cluster'),
    cpus = require('os').cpus(),
    express = require('express'),
    router = require('./library/router'),
    favicon = require('serve-favicon'),
    app = express();

app.use(
    (req, res, next) => {
        res.set('X-Powered-By', 'ibrag.it');
        return next();
    },
    favicon(__dirname + '/public/favicon.png'),
    router(express),
    (error, req, res, next) => {
        res.status(error.code || 404).end();
        next = null;
    }
);

if (cluster.isMaster) {
    for (let cpu = 0; cpu < cpus.length; cpu += 1) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });

} else {
    app.listen(process.env.PORT, () => {
        console.log('Up on port:', process.env.PORT);
    });
}
