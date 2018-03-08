/**
 * This library is a subset of https://github.com/aichholzer/trafico
 */

// Modules
const fs = require('fs');
const EventEmitter = require('events');

class Trafico extends EventEmitter {
  constructor(options = {}) {
    super();
    this.router = options.router;
    if (!options.routes || !options.controllers) {
      return this.emit('error', new Error('Routes and controllers must be set.'));
    }

    this.routes = options.routes;
    this.controllers = options.controllers;
    return this;
  }

  route() {
    /**
     * This will setup the routes, as defined in options.routes.
     * For each route, it will also try to load a corresponding controller, from options.controllers
     * If a controller is not found, then that route will not be available.
     * @returns {Router}
     */
    fs.readdirSync(this.routes).filter(file => file.endsWith('.js')).forEach((file) => {
      try {
        const route = require.call(null, `${this.routes}/${file}`);
        const controller = require.call(null, `${this.controllers}/${file}`);
        route(this.router, controller);
      } catch (error) {
        this.emit('error', new Error(`Can't load controller: ${file} | ${error.message}`));
      }
    });
  }
}

module.exports = Trafico;
