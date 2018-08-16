const crypto = require('crypto');
const query = require('querystring');

module.exports = (cometa, req, res, step) => {
  if (cometa.allowUnauthorized) {
    return step();
  }

  const { authorization: queryAuth } = req.query;
  const { authorization: headersAuth, host } = req.headers;
  const auth = queryAuth || headersAuth;
  delete req.query.authorization;

  let queryString = query.stringify(req.query);
  queryString = queryString ? `?${queryString}` : queryString;

  const serverSignature = crypto
    .createHmac('sha1', cometa.key)
    .update(`${host}${req.pathname}${queryString}`)
    .digest('hex');

  return serverSignature !== auth ? step('This request has not been authorized.', 401) : step();
};
