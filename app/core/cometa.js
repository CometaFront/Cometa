const http = require('http');

const parse = attract('core/lib/parse');
const router = attract('core/lib/router');
const stream = attract('core/lib/streams');
const {
  0: URL,
  1: S3
} = attract('core/sources/url', 'core/sources/s3');

class Cometa {
  constructor(config = {}) {
    this.s3 = config.s3;
    this.allowUnauthorized = config.allowUnauthorized;
    this.requestTimeout = config.requestTimeout;

    parse.on('error', error => router.sendError(409, error.message));
    router.get('/:signature/:source/(.*)', (req, res) => {
      const request = parse.process(req);
      let source;

      switch (request.source) {
        case 'URL': source = new URL(Object.assign(request, { requestTimeout: this.requestTimeout }));
          break;
        case 'S3': source = new S3(Object.assign(request, { s3: this.s3 }));
          break;
        default: return router.sendError(409, 'A supported image source is required.');
      }

      return source.once('error', error => error).pipe(stream.response(res));
    });

    return http.createServer((req, res) => router.process(req, res));
  }
}

module.exports = Cometa;
