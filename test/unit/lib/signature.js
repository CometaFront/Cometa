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

  afterEach(() => {
    sandbox.restore();
  });

  it('Signature', (done) => {
    should(signature).be.a.Function();
    done();
  });

  it('Signature (allowUnauthorized)', (done) => {
    const req = Object.assign({}, fake.req);
    const res = Object.assign({}, fake.res);
    const cometa = Object.assign({}, config.cometa, { allowUnauthorized: true });

    const response = signature(cometa, req, res, (message) => message || 'Pass');

    should(signature).be.a.Function();
    should(response).be.a.String();
    should(response).be.equal('Pass');

    done();
  });

  it('Signature (valid query signature)', (done) => {
    const req = Object.assign({}, fake.req);
    req.query = { auth: sign('localhost:9090/url/http://localhost:9090/car.png') };
    const res = Object.assign({}, fake.res);

    const response = signature(config.cometa, req, res, (message) => message || 'Pass');

    should(signature).be.a.Function();
    should(response).be.a.String();
    should(response).be.equal('Pass');

    done();
  });

  it('Signature (valid query signature, with query)', (done) => {
    const req = Object.assign({}, fake.req);
    req.query = {
      auth: sign('localhost:9090/url/http://localhost:9090/car.png?w=10&h=10'),
      w: 10,
      h: 10
    };
    const res = Object.assign({}, fake.res);

    const response = signature(config.cometa, req, res, (message) => message || 'Pass');

    should(signature).be.a.Function();
    should(response).be.a.String();
    should(response).be.equal('Pass');

    done();
  });

  it('Signature (invalid query signature)', (done) => {
    const req = Object.assign({}, fake.req);
    req.query = { auth: sign('localhost:9090/url/http://localhost:9090/car.png', '123') };
    const res = Object.assign({}, fake.res);

    const response = signature(config.cometa, req, res, (message) => message || 'Pass');

    should(signature).be.a.Function();
    should(response).be.a.String();
    should(response).be.equal('This request is not authorized.');

    done();
  });

  it('Signature (valid headers signature)', (done) => {
    const req = Object.assign({}, fake.req);
    req.headers.auth = sign('localhost:9090/url/http://localhost:9090/car.png');
    const res = Object.assign({}, fake.res);

    const response = signature(config.cometa, req, res, (message) => message || 'Pass');

    should(signature).be.a.Function();
    should(response).be.a.String();
    should(response).be.equal('Pass');

    done();
  });

  it('Signature (valid headers signature, with query)', (done) => {
    const req = Object.assign({}, fake.req);
    req.headers.auth = sign('localhost:9090/url/http://localhost:9090/car.png?w=10&h=10');
    req.query = { w: 10, h: 10 };
    const res = Object.assign({}, fake.res);

    const response = signature(config.cometa, req, res, (message) => message || 'Pass');

    should(signature).be.a.Function();
    should(response).be.a.String();
    should(response).be.equal('Pass');

    done();
  });

  it('Signature (invalid headers signature)', (done) => {
    const req = Object.assign({}, fake.req);
    req.headers.auth = sign('localhost:9090/url/http://localhost:9090/car.png', '123');
    const res = Object.assign({}, fake.res);

    const response = signature(config.cometa, req, res, (message) => message || 'Pass');

    should(signature).be.a.Function();
    should(response).be.a.String();
    should(response).be.equal('This request is not authorized.');

    done();
  });
};
