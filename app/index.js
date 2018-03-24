// Modules
const cluster = require('cluster');
const cpus = require('os').cpus();
const http = require('http');

// Libraries
const parse = require('./lib/parse');
const router = require('./lib/router');
const signature = require('./lib/signature');
const stream = require('./lib/streams');
const pino = require('./lib/pino');
const { app, cometa } = require('./config');

const providers = {};
providers.URL = require('./providers/url');
providers.S3 = require('./providers/s3');

try {
  /**
   * Define the HTTP GET request handler
   */
  router.get('/:source/(.*)', signature, (req, res) => {
    try {
      const request = Object.assign(parse(req), cometa);
      if (!{}.hasOwnProperty.call(providers, request.source)) {
        return router.sendError(409, 'A supported image source is required.');
      }

      const source = new providers[request.source](request);
      return source
        .on('error', (error) => {
          source.unpipe();
          throw error;
        })
        .pipe(stream.meta())
        .pipe(stream.resize())
        .pipe(stream.filter())
        .pipe(stream.response(res));
    } catch (error) {
      return router.sendError(409, error.message);
    }
  });

  /**
   * Create the server
   */
  const server = http.createServer((req, res) => router.process(req, res));

  /**
   * Get the server to listen on the given port.
   * Run one process per CPU core, if enabled.
   */
  if (app.cluster && cluster.isMaster) {
    for (let cpu = 0; cpu < cpus.length; cpu += 1) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      pino.warn(`Dead worker: ${worker.process.pid}; ${code} | ${signal}`);
      cluster.fork();
    });
  } else {
    const worker = app.cluster ? `| Worker: ${cluster.worker.process.pid}` : '';
    server.listen(app.port, () => pino.info(`Up on port: ${app.port} ${worker}`));
  }
} catch (error) {
  pino.fatal(error.message);
}
