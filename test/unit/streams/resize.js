const fs = require('fs');
const sinon = require('sinon');
const should = require('should');
const pino = require('../../../app/lib/pino');
const resize = require('../../../app/streams/resize');

const sandbox = sinon.createSandbox();
module.exports = () => {
  beforeEach(() => {});

  afterEach(() => {
    sandbox.restore();
  });

  it('resize', (done) => {
    should(resize).be.a.Function();
    should(resize()).be.an.Object();

    done();
  });

  it('resize (image)', (done) => {
    fs.readFile('./test/unit/support/cometa.png', (error, data) => {
      const stream = resize();
      should(stream).be.an.Object();
      should(stream).have.properties('_transform');
      stream.end({ body: data, output: { width: 50, height: 50 } });
      stream.on('data', (image) => {
        should(image).be.an.Object();
        should(image).have.properties('body', 'output');
        should(image.body).not.be.equal(data);

        done();
      });
    });
  });

  it('resize (invalid body)', (done) => {
    sandbox.stub(pino, 'error').callsFake((error) => {
      should(error).be.an.Object();
      should(error).have.properties('message');
      should(error.message).be.equal('Input file is missing or of an unsupported image format');

      done();
    });

    const stream = resize();
    should(stream).be.an.Object();
    should(stream).have.properties('_transform');
    stream.end({ body: 'Invalid image.', output: { width: 50, height: 50 } });
    stream.on('error', (error) => {
      should(error).be.an.Object();
    });
  });

  it('resize (no resize)', (done) => {
    fs.readFile('./test/unit/support/cometa.png', (error, data) => {
      const stream = resize();
      should(stream).be.an.Object();
      should(stream).have.properties('_transform');
      stream.end({ body: data });
      stream.on('data', (image) => {
        should(image).be.an.Object();
        should(image).have.properties('body');
        should(image.body).be.equal(data);

        done();
      });
    });
  });
};
