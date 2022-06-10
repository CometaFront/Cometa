const fs = require('fs');
const sinon = require('sinon');
const should = require('should');
const fake = require('../support/fake');
const response = require('../../../app/streams/response');

const sandbox = sinon.createSandbox();
module.exports = () => {
  beforeEach(() => {});
  afterEach(() => sandbox.restore());

  it('response', (done) => {
    should(response).be.a.Function();
    should(response()).be.an.Object();

    done();
  });

  it('response (write head, .png)', (done) => {
    const res = fake.res();
    sandbox.stub(res, 'writeHead').callsFake((status, headers) => {
      should(status).be.a.Number();
      should(status).equal(200);
      should(headers)
        .be.an.Object()
        .with.properties(
          'Etag',
          'Expires',
          'Vary',
          'Content-Type',
          'Cache-Control',
          'Content-Length',
          'Last-Modified',
          'X-Powered-by'
        );
      should(headers['Content-Type']).equal('image/png');

      done();
    });

    fs.readFile('./test/unit/support/cometa.png', (error, data) => {
      const stream = response(res);
      should(stream).be.an.Object().with.property('_write');

      stream.end({ body: data, output: { extension: 'png' } });
    });
  });

  it('response (write head, .jpg)', (done) => {
    const res = fake.res();
    sandbox.stub(res, 'writeHead').callsFake((status, headers) => {
      should(status).be.a.Number();
      should(status).equal(200);
      should(headers)
        .be.an.Object()
        .with.properties(
          'Etag',
          'Expires',
          'Vary',
          'Content-Type',
          'Cache-Control',
          'Content-Length',
          'Last-Modified',
          'X-Powered-by'
        );
      should(headers['Content-Type']).equal('image/jpeg');

      done();
    });

    fs.readFile('./test/unit/support/cometa.png', (error, data) => {
      const stream = response(res);
      should(stream).be.an.Object().with.property('_write');

      stream.end({ body: data, output: { extension: 'jpg' } });
    });
  });

  it('response (write body, .png)', (done) => {
    const res = fake.res();
    sandbox.stub(res, 'write').callsFake((image) => {
      should(image).be.an.Object();
      should(image.length).be.equal(59184);
      done();
    });

    fs.readFile('./test/unit/support/cometa.png', (error, data) => {
      const stream = response(res);
      should(stream).be.an.Object().with.property('_write');

      stream.end({ body: data, output: { extension: 'png' } });
    });
  });

  it('response (write body, .jpg)', (done) => {
    const res = fake.res();
    sandbox.stub(res, 'write').callsFake((image) => {
      should(image).be.an.Object();
      should(image.length).be.equal(34786);
      done();
    });

    fs.readFile('./test/unit/support/cometa.png', (error, data) => {
      const stream = response(res);
      should(stream).be.an.Object().with.property('_write');

      stream.end({ body: data, output: { extension: 'jpg' } });
    });
  });

  it('resize (invalid body)', (done) => {
    sandbox.stub(process.stderr, 'write').callsFake((error) => {
      const match = error.match(/(COMETA)|(\[.*])|(Input file is missing)/g);
      should(match[0]).equal('COMETA');
      should(match[2]).equal('Input file is missing');

      done();
    });

    const stream = response(fake.res());
    should(stream).be.an.Object();
    stream.end({ body: 'Invalid image.', output: { extension: 'jpg' } });
  });

  it('resize (invalid output)', (done) => {
    sandbox.stub(process.stderr, 'write').callsFake((error) => {
      const match = error.match(
        /(COMETA)|(\[.*])|(TypeError: Cannot read properties of undefined \(reading 'quality'\))/g
      );

      should(match[0]).equal('COMETA');
      should(match[2]).equal(`TypeError: Cannot read properties of undefined (reading 'quality')`);

      done();
    });

    fs.readFile('./test/unit/support/cometa.png', (error, data) => {
      const stream = response(fake.res());
      should(stream).be.an.Object();
      stream.end({ body: data });
    });
  });

  it('resize (invalid output extension)', (done) => {
    sandbox.stub(process.stderr, 'write').callsFake((error) => {
      const match = error.match(/(COMETA)|(\[.*])|(is not a function)/g);
      should(match[0]).equal('COMETA');
      should(match[2]).equal('is not a function');

      done();
    });

    fs.readFile('./test/unit/support/cometa.png', (error, data) => {
      const stream = response(fake.res());
      should(stream).be.an.Object();
      stream.end({ body: data, output: {} });
    });
  });
};
