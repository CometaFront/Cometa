require('dotenv');

const unit = (lib) => require.call(null, `./${lib}`);
describe('Unit testing', () => {
  describe('➔ Libraries', () => {
    describe('• config', unit('lib/config'));
    describe('• log', unit('lib/log'));
    describe('• parse', unit('lib/parse'));
    describe('• signature', unit('lib/signature'));
    describe('• streams', unit('lib/streams'));
  });

  describe('➔ Providers', () => {
    describe('• S3', unit('providers/s3'));
    describe('• URL', unit('providers/url'));
  });

  describe('➔ Streams', () => {
    describe('• meta', unit('streams/meta'));
    describe('• resize', unit('streams/resize'));
    describe('• response', unit('streams/response'));
  });
});
