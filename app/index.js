const rayo = require('rayo');
const log = require('./lib/log');
const parse = require('./lib/parse');
const signature = require('./lib/signature');
const stream = require('./lib/streams');
const { app, cometa } = require('./config');

const providers = {
  URL: require.call(null, './providers/url'),
  S3: require.call(null, './providers/s3')
};

try {
  rayo({ port: app.port, storm: app.cluster })
    .through(signature.bind(null, cometa))
    .get('/:provider/*', (req, res, step) => {
      try {
        const request = {
          ...parse(req),
          ...cometa
        };

        if (request.output.extension instanceof Error) {
          return step(request.output.extension.message, 409);
        }

        if (!{}.hasOwnProperty.call(providers, request.provider)) {
          return step(`${request.provider} is not a supported image provider.`, 409);
        }

        const source = new providers[request.provider](request);
        return source
          .on('provided', (message) => log.info(message))
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
    })
    .start((address) => log.info(`Up on port: ${address.port}`));
} catch (error) {
  log.error(error.message);
}
