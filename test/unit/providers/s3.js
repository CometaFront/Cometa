const aws = require('aws-sdk');
const should = require('should');
const sinon = require('sinon');
const { Readable } = require('stream');
const config = require('../../../app/config');
const S3 = require('../../../app/providers/s3');

const sandbox = sinon.createSandbox();
module.exports = () => {
  beforeEach(() => {});

  afterEach(() => {
    sandbox.restore();
  });

  it('S3', (done) => {
    should(S3).be.a.Function();

    done();
  });

  it('S3', (done) => {
    const cometa = Object.assign({}, config.cometa, { output: { extension: 'png' } });
    const provider = new S3(cometa);

    sandbox.stub(aws.Request.prototype, 'send').yields(null, {
      Body: 'Image data.'
    });

    provider.on('data', (chunk) => {
      should(provider).be.an.Object();
      should(provider).be.instanceOf(Readable);
      should(provider).have.property('_read');
      should(chunk).be.an.Object();
      should(chunk).have.properties('output', 'body', 'originalSize');
      should(chunk.output).be.an.Object();
      should(chunk.output.extension).be.equal('png');
      should(chunk.body).be.equal('Image data.');
      should(chunk.originalSize).be.equal(11);

      done();
    });
  });

  it('S3 (no config)', (done) => {
    let provider;
    try {
      provider = new S3();
    } catch (error) {
      should(!!provider).be.equal(false);
      should(error).be.an.Object();
      should(error).have.properties('message');
      should(error.message).be.equal('Configuration is required.');

      done();
    }
  });

  it('S3 (error)', (done) => {
    const cometa = Object.assign({}, config.cometa);
    const provider = new S3(cometa);

    sandbox.stub(aws.Request.prototype, 'send').yields(new Error('Testing error.'));
    provider.on('error', (error) => {
      should(provider).be.an.Object();
      should(provider).be.instanceOf(Readable);
      should(provider).have.property('_read');
      should(error).be.an.Object();
      should(error).have.property('message');
      should(error.message).be.equal('Testing error.');

      done();
    });

    provider.pipe(process.stdout);
  });
};
