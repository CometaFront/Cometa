const Trafico = require('trafico');

module.exports = (options = {}) => {
  if (!options.express || !options.routes || !options.controllers) {
    throw new Error('Application can\'t be routed; express, routes and controllers must be defined.');
  }

  try {
    const traffic = new Trafico(options);
    return traffic.route();
  } catch (error) {
    throw new Error(`Application can't be routed; ${error.stack}`);
  }
};
