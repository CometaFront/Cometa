// Modules
const cluster = require('cluster');
const cpus = require('os').cpus();
const rayo = require('rayo');

// Libraries
const parse = require('./lib/parse');
const signature = require('./lib/signature');
const stream = require('./lib/streams');
const pino = require('./lib/pino');
const { app, cometa } = require('./config');

const providers = {};
providers.URL = require('./providers/url');
providers.S3 = require('./providers/s3');

try {
  const ray = rayo({ port: app.port })
    .through(signature.bind(null, cometa))
    .get('/:provider/*', (req, res, step) => {
      try {
        const request = Object.assign(parse(req), cometa);
        if (request.output.extension instanceof Error) {
          return step(request.output.extension.message, 409);
        }

        if (!{}.hasOwnProperty.call(providers, request.provider)) {
          return step(`${request.provider} is not a supported image provider.`, 409);
        }

        const source = new providers[request.provider](request);
        return source
          .on('error', (error) => {
            source.unpipe();
            throw error;
          })
          .pipe(stream.meta())
          .pipe(stream.resize())
          .pipe(stream.response(res));
      } catch (error) {
        return step(error.message, 409);
      }
    });

  /**
   * Get Rayo to listen on the given port.
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
    ray.start(() => pino.info(`Up on port: ${app.port} ${worker}`));
  }
} catch (error) {
  pino.fatal(error.message);
}
