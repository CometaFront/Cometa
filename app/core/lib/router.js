const ptr = require('path-to-regexp');
const { parse } = require('url');

class Handler {
  constructor(method) {
    this.run = (...args) => method.apply(this, args);
  }
}

class Response {
  constructor() {
    this.statusCode = 200;
  }

  status() {
    this.res.writeHead(this.statusCode, { 'Content-Type': 'application/json' });
  }

  send(response) {
    this.status();
    this.res.write(JSON.stringify({ error: response }));
    this.res.end();
  }

  sendError(...args) {
    this.statusCode = 404;
    if (args.length && typeof args[0] === 'number') {
      ({ 0: this.statusCode } = args);
      args.shift();
    }

    this.status();
    this.res.write(JSON.stringify({ error: args[0] }));
    this.res.end();
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
    this.req = req;
    this.req.params = {};
    this.req.query = {};
    this.res = res;

    const method = this.req.method.toLowerCase();
    this.req = Object.assign(this.req, parse(this.req.url, true));
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
          res.send = (...args) => this.send(...args);
          return handler.run(req, res);
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
