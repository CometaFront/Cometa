// Modules
require('attract')({ basePath: __dirname });
const cluster = require('cluster');
const cpus = require('os').cpus();
const http = require('http');

// Libraries
const parse = attract('lib/parse');
const router = attract('lib/router');
const signature = attract('lib/signature');
const stream = attract('lib/streams');
const pino = attract('lib/pino');
const { app, cometa } = attract('config');

const sources = {};
({ 0: sources.URL, 1: sources.S3 } = attract('sources/url', 'sources/s3'));

try {
  /**
   * Define the HTTP GET request handler
   */
  router.get('/:source/(.*)', signature, (req, res) => {
    try {
      const request = Object.assign(parse(req), cometa);
      if (!Object.prototype.hasOwnProperty.call(sources, request.source)) {
        return router.sendError(409, 'A supported image source is required.');
      }

      const source = new sources[request.source](request);
      return source.on('error', (error) => {
        source.unpipe();
        throw error;
      }).pipe(stream.resize())
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
