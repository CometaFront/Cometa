const aws = require('aws-sdk');
const should = require('should');
const sinon = require('sinon');
const { Readable } = require('stream');
const config = require('../../../app/config');
const S3 = require('../../../app/providers/s3');

const sandbox = sinon.createSandbox();
module.exports = () => {
  beforeEach(() => {});
  afterEach(() => sandbox.restore());

  it('Should be a function.', (done) => {
    should(S3).be.a.Function();

    done();
  });

  it('Sould return an image.', (done) => {
    sandbox
      .stub(aws.Request.prototype, 'send')
      .yields(null, { Body: 'Binary image data will be here.' });

    const provider = new S3({
      ...config.cometa,
      ...{ output: { extension: 'png' } }
    });
    provider
      .on('provided', (message) => {
        should(message).equal('Image received from S3 provider.');
      })
      .on('data', (chunk) => {
        should(provider)
          .be.an.Object()
          .and.be.instanceOf(Readable)
          .with.property('_read');

        should(chunk)
          .be.an.Object()
          .with.properties('output', 'body', 'originalSize');

        should(chunk.output).be.an.Object();
        should(chunk.output.extension).equal('png');
        should(chunk.body).equal('Binary image data will be here.');
        should(chunk.originalSize).equal(31);

        done();
      });
  });

  it('Should fail (no config)', (done) => {
    let provider;
    try {
      provider = new S3();
    } catch (error) {
      should(!!provider).equal(false);
      should(error)
        .be.an.Object()
        .with.property('message');

      should(error.message).equal('Configuration is required.');

      done();
    }
  });

  it('Should fail (throw error)', (done) => {
    sandbox.stub(aws.Request.prototype, 'send').yields(new Error('Testing error.'));

    const provider = new S3(config.cometa);
    provider.on('error', (error) => {
      should(provider)
        .be.an.Object()
        .and.instanceOf(Readable)
        .with.property('_read');

      should(error)
        .be.an.Object()
        .with.property('message');

      should(error.message).equal('Testing error.');

      done();
    });

    provider.pipe(process.stdout);
  });
};
