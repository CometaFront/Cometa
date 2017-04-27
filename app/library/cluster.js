'use strict';


const cluster = require('cluster');
const cores = require('os').cpus();

module.exports = (app, port) => {

    if (cluster.isMaster && process.env.APP_CLUSTER) {
        for (let cpu = 0; cpu < cores.length; cpu += 1) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died. Code/signal: ${code}/${signal}`);
            cluster.fork();
        });

    } else {
        app.listen(port, () => {
            console.log(`Up on port: ${port}`);
        });
    }
};
