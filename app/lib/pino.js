// Modules
const pino = require('pino');

// Libraries
const config = attract('config');

const logger = pino({
  name: config.log.name || 'Cometa',
  level: config.log.level || 'info',
  prettyPrint: config.log.prettyPrint
});

module.exports = logger;
