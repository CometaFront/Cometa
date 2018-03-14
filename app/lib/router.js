// Modules
const ptr = require('path-to-regexp');
const { parse } = require('url');

// Libraries
const pino = attract('lib/pino');

class Handler {
  constructor(method) {
    this.run = (...args) => method.apply(this, args);
  }
}

class Response {
  sendError(...args) {
    this.statusCode = 404;
    if (args.length && typeof args[0] === 'number') {
      ({ 0: this.statusCode } = args);
      args.shift();
    }

    this.res.writeHead(this.statusCode, { 'Content-Type': 'application/json' });
    this.res.write(JSON.stringify({ error: args[0] }));
    this.res.end();

    pino.warn(args[0]);
  }
}

class Router extends Response {
  constructor() {
    super();
    this.routes = {};
    return this;
  }

  route(verb, url, method) {
    if (!this.routes[verb]) {
      this.routes[verb] = [];
    }

    const keys = [];
    const regex = ptr(url, keys);
    this.routes[verb].push({ regex, keys, handler: new Handler(method) });
  }

  process(req, res) {
    this.req = Object.assign(req, { params: {}, query: {} }, parse(req.url, true));
    this.res = res;

    const method = this.req.method.toLowerCase();
    for (let r = 0; r < this.routes[method].length; r += 1) {
      const match = this.routes[method][r].regex.exec(this.req.pathname);
      if (match) {
        for (let m = 1; m < match.length; m += 1) {
          const key = this.routes[method][r].keys[m - 1];
          const prop = key.name;
          const val = match[m];

          if (val !== undefined || !(hasOwnProperty.call(this.req.params, prop))) {
            this.req.params[prop] = val;
          }
        }

        const { handler } = this.routes[method][r];
        if (handler) {
          ({ 0: this.req.path } = this.req.params);
          return handler.run(this.req, res);
        }
      }
    }

    return this.sendError('Page not found.');
  }
}

module.exports = new Proxy(new Router(), {
  get: (target, property) => {
    if (['get', 'post', 'put', 'delete'].includes(property.toString())) {
      return function applyRoute(...args) {
        args.unshift(property.toLowerCase());
        return target.route.apply(this, args);
      };
    }

    return target[property];
  }
});
