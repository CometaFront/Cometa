const http = require('http');

const parse = attract('core/lib/parse');
const router = attract('core/lib/router');
const stream = attract('core/lib/streams');

parse.on('error', error => router.sendError(409, error.message));

class Cometa {
  constructor(setup = {}) {
    let options = {};


    try {
      const Provider = attract(`core/providers/http`);
      // const provider = new Provider(setup.config).once('error', error => error);
      const provider = new Provider({ requestTimeout: 2500 }).once('error', error => error);

      router.get('/:signature/(.*)', (req, res) => {
        provider.options = parse.process(req);
        provider.pipe(stream.response(res));
      });
    } catch (error) {
      throw error;
    }

    // router.get('/:signature/*?', v, control.download);

    return http.createServer((req, res) => router.process(req, res));
  }
}

module.exports = Cometa;
