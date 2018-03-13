require('attract')({ basePath: __dirname });

const cluster = require('cluster');
const cpus = require('os').cpus();

const Cometa = attract('core/cometa');
const log = attract('core/lib/log');
const { app, cometa: cometaConf } = attract('config');

try {
  const cometa = new Cometa(cometaConf);
  if (app.cluster && cluster.isMaster) {
    for (let cpu = 0; cpu < cpus.length; cpu += 1) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      log.info(`Dead worker: ${worker.process.pid}; ${code} | ${signal}`);
      cluster.fork();
    });
  } else {
    const worker = app.cluster ? `| Worker: ${cluster.worker.process.pid}` : '';
    cometa.listen(app.port, () => log.info(`Up on port: ${app.port} ${worker}`));
  }
} catch (error) { log.error(error.message); }
