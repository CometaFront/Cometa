const parse = attract('core/lib/parse');
const S3 = attract('core/providers/s3');
const HTTP = attract('core/providers/http');
const { requestTimeout } = attract('config');

module.exports = (req) => {
  const options = parse(req);
  options.timeout = requestTimeout;

  switch (options.provider) {
    case 'S3': return new S3(options).once('error', new Error('Unknown AWS S3 error.'));
    case 'HTTP': return new HTTP(options).once('error', new Error('Unknown HTTP error.'));
    default: return null;
  }
};
