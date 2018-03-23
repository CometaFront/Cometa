// Modules
const ptr = require('path-to-regexp')
const { parse } = require('url')

// Libraries
const pino = require('./pino')

/**
 * An `error` can be passed from the middleware by next(`error`);
 * @param stack
 * @param error
 */
const runStack = function runStack (stack, error = null) {
  const next = stack.shift()
  if (error || !next) {
    return this.sendError(error || 'Nothing left in the stack.')
  }

  return next.run(this.req, this.res, runStack.bind(this, stack))
}

class Handler {
  constructor (method) {
    this.run = (...args) => method.apply(this, args)
  }
}

class Response {
  sendError (...args) {
    this.statusCode = 404
    if (args.length && typeof args[0] === 'number') {
      ({ 0: this.statusCode } = args)
      args.shift()
    }

    this.res.writeHead(this.statusCode, { 'Content-Type': 'application/json' })
    this.res.write(JSON.stringify({ error: args[0] }))
    this.res.end()

    pino.warn(args[0])
  }
}

class Router extends Response {
  constructor () {
    super()
    this.routes = {}
    return this
  }

  route (args) {
    const [method, url, ...functions] = [...args]
    if (!this.routes[method]) {
      this.routes[method] = []
    }

    const keys = []
    const regex = ptr(url, keys)

    /**
     * The `stack` is basically a middleware support implementation.
     * By passing back a stack-move-forward function, such as next(), we can allow
     * multiple middleware to be used on the same route/path.
     */
    this.routes[method].push({
      regex,
      keys,
      stack: functions.map(fn => new Handler(fn))
    })
  }

  process (req, res) {
    this.req = Object.assign(req, { params: {}, query: {} }, parse(req.url, true))
    this.res = res

    const method = this.req.method.toLowerCase()
    for (let route = 0; route < this.routes[method].length; route += 1) {
      const currentRoute = this.routes[method][route]
      const match = currentRoute.regex.exec(this.req.pathname)
      if (match) {
        return this.extractKeys(match, currentRoute)
      }
    }

    return this.sendError('Page not found.')
  }

  extractKeys (match, currentRoute) {
    const { keys, stack } = currentRoute
    for (let m = 1; m < match.length; m += 1) {
      const property = keys[m - 1].name
      const value = match[m]

      if (value !== undefined || !{}.hasOwnProperty.call(this.req.params, property)) {
        this.req.params[property] = value
      }
    }

    if (stack.length) {
      ({ 0: this.req.path } = this.req.params)
      return runStack.bind(this, stack.slice())()
    }
  }
}

module.exports = new Proxy(new Router(), {
  get: (target, property) => {
    if (['get', 'post', 'put', 'delete'].includes(property.toString())) {
      return function applyRoute (...args) {
        args.unshift(property.toLowerCase())
        return target.route.apply(this, [args])
      }
    }

    return target[property]
  }
})
