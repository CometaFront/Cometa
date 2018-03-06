const config = attract('config');
const crypto = require('crypto');
const query = require('querystring');

module.exports = (req, res, next) => {
  if (config.noAuthAllowed && req.params.signature === 'noauth') {
    return next();
  }

  const url = `/${req.params[0]}?${query.stringify(req.query)}`;
  const serverSignature = crypto.createHmac('sha1', config.key).update(req.get('host') + url).digest('hex');

  if (serverSignature === req.params.signature) {
    return next();
  }

  return next({ status: 403 });
};
