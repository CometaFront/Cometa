const crypto = require('crypto');
const should = require('should');
const sinon = require('sinon');
const config = require('../../../app/config');
const fake = require('../support/fake');
const signature = require('../../../app/lib/signature');

const sign = (payload, key = config.cometa.key) =>
  crypto
    .createHmac('sha1', key)
    .update(payload)
    .digest('hex');

const sandbox = sinon.createSandbox();
module.exports = () => {
  beforeEach(() => {});
  afterEach(() => sandbox.restore());

  it('Signature', (done) => {
    should(signature).be.a.Function();
    done();
  });

  it('Signature (allowUnauthorized)', (done) => {
    const req = fake.req();
    const cometa = {
      ...config.cometa,
      ...{ allowUnauthorized: true }
    };

    const response = signature(cometa, req, fake.res(), (message) => message || 'Pass');

    should(signature).be.a.Function();
    should(response).be.a.String();
    should(response).equal('Pass');

    done();
  });

  it('Signature (valid query signature)', (done) => {
    const req = fake.req();
    req.pathname = '/url/http://localhost:9090/car.png';
    req.query = { authorization: sign('localhost:9090/url/http://localhost:9090/car.png') };

    const response = signature(config.cometa, req, fake.res(), (message) => message || 'Pass');

    should(signature).be.a.Function();
    should(response).be.a.String();
    should(response).equal('Pass');

    done();
  });

  it('Signature (valid query signature, with query)', (done) => {
    const req = fake.req();
    req.pathname = '/url/http://localhost:9090/car.png';
    req.query = {
      authorization: sign('localhost:9090/url/http://localhost:9090/car.png?w=10&h=10'),
      w: 10,
      h: 10
    };

    const response = signature(config.cometa, req, fake.res(), (message) => message || 'Pass');

    should(signature).be.a.Function();
    should(response).be.a.String();
    should(response).equal('Pass');

    done();
  });

  it('Signature (invalid query signature)', (done) => {
    const req = fake.req();
    req.query = { authorization: sign('localhost:9090/url/http://localhost:9090/car.png', '123') };

    const response = signature(config.cometa, req, fake.res(), (message) => message || 'Pass');

    should(signature).be.a.Function();
    should(response).be.a.String();
    should(response).equal('This request has not been authorized.');

    done();
  });

  it('Signature (valid headers signature)', (done) => {
    const req = fake.req();
    req.query = {};
    req.pathname = '/url/http://localhost:9090/car.png';
    req.headers.authorization = sign('localhost:9090/url/http://localhost:9090/car.png');

    const response = signature(config.cometa, req, fake.res(), (message) => message || 'Pass');

    should(signature).be.a.Function();
    should(response).be.a.String();
    should(response).equal('Pass');

    done();
  });

  it('Signature (valid headers signature, with query)', (done) => {
    const req = fake.req();
    req.query = { w: 10, h: 10 };
    req.pathname = '/url/http://localhost:9090/car.png';
    req.headers.authorization = sign('localhost:9090/url/http://localhost:9090/car.png?w=10&h=10');

    const response = signature(config.cometa, req, fake.res(), (message) => message || 'Pass');

    should(signature).be.a.Function();
    should(response).be.a.String();
    should(response).equal('Pass');

    done();
  });

  it('Signature (invalid headers signature)', (done) => {
    const req = fake.req();
    req.query = {};
    req.headers.authorization = sign('localhost:9090/url/http://localhost:9090/car.png', '123');

    const response = signature(config.cometa, req, fake.res(), (message) => message || 'Pass');

    should(signature).be.a.Function();
    should(response).be.a.String();
    should(response).equal('This request has not been authorized.');

    done();
  });
};
