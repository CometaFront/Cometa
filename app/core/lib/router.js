const { parse } = require('url');

const Trafico = attract('core/lib/trafico');

class Handler {
  constructor(method) {
    this.run = (...args) => method.apply(this, args);
  }
}

class Response {
  constructor() {
    this.statusCode = 200;
  };

  status() {
    this.res.writeHead(this.statusCode, {
      'Content-Type': 'application/json'
    });
  }

  send() {
    this.status();
    this.res.write(JSON.stringify({ error: 'YAY' }));
    this.res.end();
  }

  send() {
    this.status();
    this.res.write(JSON.stringify({ error: 'YAY' }));
    this.res.end();
  }

  notFound() {
    this.status(404);
    this.res.write(JSON.stringify({ error: 'Page no found' }));
    this.res.end();
  }
}

class Router extends Response {
  constructor() {
    super();
    this.routes = {};
    return this;
  }

  use(options = {}) {
    options.router = this;
    const trafico = new Trafico(options);
    trafico.on('error', (error) => { throw error; });
    trafico.route();
  }

  route(verb, url, method) {
    if (!this.routes[verb]) {
      this.routes[verb] = {};
    }

    this.routes[verb][url] = new Handler(method);
  }

  process(req, res) {
    this.req = req;
    this.res = res;

    let { method, url } = this.req;
    method = method.toLowerCase();
    url = parse(url, true);

    const handler = this.routes[method][url.pathname];
    if (handler) {
      res.send = (...args) => this.send(...args);
      return handler.run(req, res);
    }

    return this.notFound();
  }
}

module.exports = new Proxy(new Router(), {
  get: (target, property) => {
    if (['get', 'post', 'put', 'delete'].includes(property)) {
      return function applyRoute(...args) {
        args.unshift(property.toLowerCase());
        return target.route.apply(this, args);
      };
    }

    return target[property];
  }
});
