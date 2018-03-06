require('attract')({ basePath: __dirname });

const express = require('express');
const cluster = require('cluster');
const cores = require('os').cpus();
const powered = require('powered');
const config = attract('config');
const app = express();

const log = attract('core/lib/log');
const router = attract('core/lib/router');

app.use(
  powered(),
  require('serve-favicon')(`${__dirname}/public/favicon.png`),
  router({
    express,
    routes: `${__dirname}/core/routes`,
    controllers: `${__dirname}/core/controllers`
  })
);

if (config.port.cluster && cluster.isMaster) {
  for (let cpu = 0; cpu < cores.length; cpu += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    log.info(`Dead worker: ${worker.process.pid}; ${code}/${signal}`);
    cluster.fork();
  });
} else {
  app.listen(config.port, () => log.info(`Up: ${config.port}`));
}
