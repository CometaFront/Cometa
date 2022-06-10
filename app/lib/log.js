const { log } = require('../config');

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const fn = (prop, args) => {
  if ((levels[prop] || 0) >= levels[log.level]) {
    const message = args
      .map((a) =>
        // eslint-disable-next-line no-nested-ternary
        a instanceof Error ? a.stack : typeof a === 'object' ? JSON.stringify(a, null, 2) : a
      )
      .join('\n');

    const stream = ['warn', 'error'].includes(prop) ? process.stderr : process.stdout;
    stream.write(`${log.name} [${new Date().toLocaleString()}] ${message}`);
  }
};

/**
 * Keep in mind that logging (writing to the console) can be an expensive operation
 * in high traffic situations and it will have an impact on performance-sensitive
 * applications.
 *
 * Use with caution.
 */
module.exports = new Proxy(console, {
  get:
    (target, prop) =>
    (...args) =>
      fn(prop, args)
});
