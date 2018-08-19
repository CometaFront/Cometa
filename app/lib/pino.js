const pino = require('pino');
const { log } = require('../config');

const logger = pino({
  name: log.name || 'Cometa',
  level: log.level || 'info'
});

module.exports = logger;
