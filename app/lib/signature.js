// Modules
const crypto = require('crypto');
const query = require('querystring');

// Libraries
const { cometa } = attract('config');

/**
 * next() needs to be implemented on the router.
 */
module.exports = (req, next) => {
  if (cometa.allowUnauthorized && req.params.signature === 'noauth') {
    return next();
  }

  const url = `/${req.params[0]}?${query.stringify(req.query)}`;
  // Consider JWT
  const serverSignature = crypto.createHmac('sha1', cometa.key).update(req.get('host') + url).digest('hex');

  if (serverSignature === req.params.signature) {
    return next();
  }

  return next({ status: 403 });
};
