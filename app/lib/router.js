// Modules
const ptr = require('path-to-regexp');
const { parse } = require('url');

// Libraries
const pino = require('./pino');

/**
 * An `error` can be passed from the middleware by next(`error`);
 * @param stack
 * @param error
 */
const runStack = function runStack(stack, error = null) {
  const next = stack.shift();
  if (error || !next) {
    return this.sendError(error || 'Nothing left in the stack.');
  }

  return next.run(this.req, this.res, runStack.bind(this, stack));
};

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

    return pino.warn(args[0]);
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
      stack: functions.map((fn) => new Handler(fn))
    });
  }

  /**
   * @TODO -Only store a route once, per method.
   * @TODO -Request body support, in parse()
   */
  process(req, res) {
    this.req = Object.assign(req, { params: {}, query: {} }, parse(req.url, true));
    this.res = res;

    const method = this.req.method.toLowerCase();
    const methodRoutes = this.routes[method];
    if (!methodRoutes || !methodRoutes.length) {
      return this.sendError('No routes for this method were found.');
    }

    for (let route = 0; route < methodRoutes.length; route += 1) {
      const currentRoute = methodRoutes[route];
      const match = currentRoute.regex.exec(this.req.pathname);
      if (match) {
        return this.getParams(match, currentRoute);
      }
    }

    return this.sendError('Page not found.');
  }

  getParams(match, currentRoute) {
    const { keys, stack } = currentRoute;
    for (let m = 1; m < match.length; m += 1) {
      const property = keys[m - 1].name;
      const value = match[m];
      const hasProperty = {}.hasOwnProperty.call(this.req.params, property);

      if (typeof value !== 'undefined' || !hasProperty) {
        this.req.params[property] = value;
      }
    }

    ({ 0: this.req.path } = this.req.params);
    return runStack.bind(this, stack.slice())();
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
