require('attract')({ basePath: __dirname });

const cluster = require('cluster');
const cpus = require('os').cpus();

const Cometa = attract('core/cometa');
const log = attract('core/lib/log');
const {
  aws,
  port,
  useCluster
} = attract('config');

try {
  const cometa = new Cometa({ provider: 's3', config: aws });

  if (useCluster && cluster.isMaster) {
    for (let cpu = 0; cpu < cpus.length; cpu += 1) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      log.info(`Dead worker: ${worker.process.pid}; ${code} | ${signal}`);
      cluster.fork();
    });
  } else {
    const worker = useCluster ? `| Worker: ${cluster.worker.process.pid}` : '';
    cometa.listen(port, () => log.info(`Up on port: ${port} ${worker}`));
  }
} catch (error) { log.error(error.message); }
