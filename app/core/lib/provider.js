const parse = attract('core/lib/parse');
const S3 = attract('core/providers/s3');
const HTTP = attract('core/providers/http');
const { requestTimeout } = attract('config');

module.exports = (req, next) => {
  const options = parse(req);
  options.timeout = requestTimeout;

  switch (options.provider) {
    case 'S3': return new S3(options).once('error', next);
    case 'HTTP': return new HTTP(options).once('error', next);
    default: return next();
  }
};
