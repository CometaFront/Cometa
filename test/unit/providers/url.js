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

  afterEach(() => {
    sandbox.restore();
  });

  it('URL', (done) => {
    should(URL).be.a.Function();

    done();
  });

  it('URL (http)', (done) => {
    const cometa = Object.assign(
      {},
      config.cometa,
      { input: 'http://localhost:9090/car.png' },
      { output: { extension: 'png' } }
    );
    const provider = new URL(cometa);

    sandbox.stub(http, 'get').yields(Object.assign(fake.res, { statusCode: 200 }));

    provider.on('data', (image) => {
      should(provider).be.an.Object();
      should(provider).be.instanceOf(Readable);
      should(provider).have.property('_read');
      should(image).be.an.Object();
      should(image).have.properties('output', 'body', 'originalSize');
      should(image.output).be.an.Object();
      should(image.output.extension).be.equal('png');
      should(image.body.toString()).be.equal('Image data.');
      should(image.originalSize).be.equal(11);

      done();
    });
  });

  it.skip('URL (https)', (done) => {
    const cometa = Object.assign(
      {},
      config.cometa,
      { input: 'https://localhost:9090/car.png' },
      { output: { extension: 'png' } }
    );
    const provider = new URL(cometa);

    sandbox.stub(https, 'get').yields(Object.assign(fake.res, { statusCode: 200 }));

    provider.on('data', (image) => {
      should(provider).be.an.Object();
      should(provider).be.instanceOf(Readable);
      should(provider).have.property('_read');
      should(image).be.an.Object();
      should(image).have.properties('output', 'body', 'originalSize');
      should(image.output).be.an.Object();
      should(image.output.extension).be.equal('png');
      should(image.body.toString()).be.equal('Image data.');
      should(image.originalSize).be.equal(11);

      done();
    });
  });

  it('URL (no config)', (done) => {
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

  it('URL (error)', (done) => {
    const cometa = Object.assign({}, config.cometa, {
      input: 'http://localhost:9090/car.png'
    });
    const provider = new URL(cometa);

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
};
