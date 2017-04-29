'use strict';


/**
 * @TODO: Remove express, run it on plain Node.
 */
global._require = module => require(`${__dirname}/core/${module}`);
const config = _require('config');
const cluster = require('cluster');
const cores = require('os').cpus();
const express = require('express');
const app = express();

app.use(
    (req, res, next) => {
        res.set('x-powered-by', 'analogbird.com');
        return next();
    },
    require('serve-favicon')(`${__dirname}/public/favicon.png`),
    _require('router')(express),
    (error, req, res, next) => {
        console.log(error);
        res.status(error.status || 404).end();
    }
);

if (config.port.cluster && cluster.isMaster) {
    for (let cpu = 0; cpu < cores.length; ++cpu) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Dead worker: ${worker.process.pid}; ${code}/${signal}`);
        cluster.fork();
    });
} else {
    app.listen(config.port, () => console.log(`Up: ${config.port}`));
}
