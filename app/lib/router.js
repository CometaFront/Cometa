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

  route(args) {
    const [method, url, ...functions] = [...args];
    if (!this.routes[method]) {
      this.routes[method] = [];
    }

    const keys = [];
    const regex = ptr(url, keys);

    /**
     * The `stack` is basically a middleware support implementation.
     * By passing back a stack-move-forward function, such as next(), we can allow
     * multiple middleware to be used on the same route/path.
     */
    this.routes[method].push({
      regex,
      keys,
      stack: functions.map(fn => new Handler(fn))
    });
  }

  process(req, res) {
    this.req = Object.assign(req, { params: {}, query: {} }, parse(req.url, true));
    this.res = res;

    const method = this.req.method.toLowerCase();

    /**
     * this.routes[method]
     * this.routes['get'] = [
     *   {
     *     regex,
     *     keys,
     *     stack
     *   }
     * ]
     */
    for (let route = 0; route < this.routes[method].length; route += 1) {
      const currentRoute = this.routes[method][route];
      const match = currentRoute.regex.exec(this.req.pathname);
      if (match) {
        for (let m = 1; m < match.length; m += 1) {
          const key = currentRoute.keys[m - 1];
          const prop = key.name;
          const val = match[m];

          if (val !== undefined || !(hasOwnProperty.call(this.req.params, prop))) {
            this.req.params[prop] = val;
          }
        }

        const { stack } = currentRoute;
        if (stack.length) {
          ({ 0: this.req.path } = this.req.params);

          // Take care of the stack/handler/next
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
        return target.route.apply(this, [args]);
      };
    }

    return target[property];
  }
});
