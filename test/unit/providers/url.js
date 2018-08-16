const http = require('http');
const https = require('https');
const should = require('should');
const sinon = require('sinon');
const { Readable } = require('stream');
const config = require('../../../app/config');
const fake = require('../support/fake');
const URL = require('../../../app/providers/url');

const sandbox = sinon.createSandbox();
module.exports = () => {
  beforeEach(() => {});
  afterEach(() => sandbox.restore());

  it('Should be a function.', (done) => {
    should(URL).be.a.Function();

    done();
  });

  it('Sould return an image (http).', (done) => {
    const provider = new URL({
      ...config.cometa,
      ...{ input: 'http://localhost:9090/car.png' },
      ...{ output: { extension: 'png' } }
    });

    const res = fake.res();
    res.headers = { 'content-length': '' };

    sinon.stub(res, 'statusCode').value(200);
    sandbox.stub(http, 'get').yields(res);

    provider
      .on('provided', (message) => {
        should(message).be.equal('Image received from URL provider.');
      })
      .on('data', (image) => {
        should(provider).be.an.Object();
        should(provider).be.instanceOf(Readable);
        should(provider).have.property('_read');
        should(image).be.an.Object();
        should(image).have.properties('output', 'body', 'originalSize');
        should(image.output).be.an.Object();
        should(image.output.extension).be.equal('png');
        should(image.body.toString()).be.equal('Binary image data will be here.');
        should(image.originalSize).be.equal(31);

        done();
      });
  });

  it('Sould return an image (https).', (done) => {
    const provider = new URL({
      ...config.cometa,
      ...{ input: 'https://localhost:9090/car.png' },
      ...{ output: { extension: 'png' } }
    });

    const res = fake.res();
    res.headers = { 'content-length': 31 };

    sinon.stub(res, 'statusCode').value(200);
    sandbox.stub(https, 'get').yields(res);

    provider
      .on('provided', (message) => {
        should(message).be.equal('Image received from URL provider.');
      })
      .on('data', (image) => {
        should(provider).be.an.Object();
        should(provider).be.instanceOf(Readable);
        should(provider).have.property('_read');
        should(image).be.an.Object();
        should(image).have.properties('output', 'body', 'originalSize');
        should(image.output).be.an.Object();
        should(image.output.extension).be.equal('png');
        should(image.body.toString()).be.equal('Binary image data will be here.');
        should(image.originalSize).be.equal(31);

        done();
      });
  });

  it('Should fail (no config).', (done) => {
    let provider;
    try {
      provider = new URL();
    } catch (error) {
      should(!!provider).be.equal(false);
      should(error).be.an.Object();
      should(error).have.properties('message');
      should(error.message).be.equal('Configuration is required.');

      done();
    }
  });

  it('Should fail (image not found, http).', (done) => {
    const provider = new URL({
      ...config.cometa,
      ...{ input: 'http://localhost:9090/car.png' }
    });

    sandbox.stub(http, 'get').yields({ statusCode: 404 });
    provider.on('error', (error) => {
      should(provider).be.an.Object();
      should(provider).be.instanceOf(Readable);
      should(provider).have.property('_read');
      should(error).be.an.Object();
      should(error).have.property('message');
      should(error.message).be.equal('The requested image could not be found.');

      done();
    });

    provider.pipe(process.stdout);
  });

  it('Should fail (image not found, https).', (done) => {
    const provider = new URL({
      ...config.cometa,
      ...{ input: 'https://localhost:9090/car.png' }
    });

    sandbox.stub(https, 'get').yields({ statusCode: 404 });
    provider.on('error', (error) => {
      should(provider).be.an.Object();
      should(provider).be.instanceOf(Readable);
      should(provider).have.property('_read');
      should(error).be.an.Object();
      should(error).have.property('message');
      should(error.message).be.equal('The requested image could not be found.');

      done();
    });

    provider.pipe(process.stdout);
  });
};
