const { LOG_NAME: name } = process.env;
const log = (prop, args) => {
  return `${name || 'LOG'} [${new Date().toLocaleString()}] ${args
    .map((a) => {
      if (a instanceof Error) {
        return a.stack;
      }

      return typeof a === 'object' ? JSON.stringify(a, null, 2) : a;
    })
    .join('\n')}`;
};

/**
 * Keep in mind that logging (writing to the console) can be an expensive operation
 * in high traffic situations and it will have an impact on performance-sensitive
 * applications.
 *
 * Use with caution.
 */
module.exports = new Proxy(console, {
  get: (target, prop) => (...args) => {
    const stream = ['warn', 'error'].includes(prop) ? process.stderr : process.stdout;
    return stream.write(log(prop, args));
  }
});
