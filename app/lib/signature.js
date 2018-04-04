// Modules
const crypto = require('crypto');
const query = require('querystring');

/**
 * @param cometa -Bound configuration object
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
module.exports = (cometa, req, res, next) => {
  if (cometa.allowUnauthorized) {
    return next();
  }

  const { auth: queryAuth } = req.query;
  const { auth: headersAuth, host } = req.headers;
  const auth = queryAuth || headersAuth;
  delete req.query.auth;

  let queryString = query.stringify(req.query);
  queryString = queryString ? `?${queryString}` : queryString;

  const serverSignature = crypto
    .createHmac('sha1', cometa.key)
    .update(`${host}${req.pathname}${queryString}`)
    .digest('hex');

  const response = serverSignature !== auth ? 'This request is not authorized.' : '';
  return next(response);
};
