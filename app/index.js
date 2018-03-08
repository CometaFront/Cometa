require('attract')({ basePath: __dirname });

const cluster = require('cluster');
const cpus = require('os').cpus();
const http = require('http');

const log = attract('core/lib/log');
const router = attract('core/lib/router');
const { port, useCluster } = attract('config');

try {
  router.use({
    routes: `${__dirname}/core/routes`,
    controllers: `${__dirname}/core/controllers`
  });
  const server = http.createServer((req, res) => router.process(req, res));

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
    server.listen(port, () => log.info(`Up on port: ${port} ${worker}`));
  }
} catch (error) { log.error(error.message); }
