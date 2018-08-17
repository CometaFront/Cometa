const fs = require('fs');
const sinon = require('sinon');
const should = require('should');
const pino = require('../../../app/lib/pino');
const meta = require('../../../app/streams/meta');

const sandbox = sinon.createSandbox();
module.exports = () => {
  beforeEach(() => {});
  afterEach(() => sandbox.restore());

  it('meta', (done) => {
    should(meta).be.a.Function();
    should(meta()).be.an.Object();

    done();
  });

  it('meta (image)', (done) => {
    fs.readFile('./test/unit/support/cometa.png', (error, data) => {
      const stream = meta();
      should(stream).be.an.Object();
      should(stream).have.properties('_transform');
      stream.end({ body: data });
      stream.on('data', (image) => {
        should(image).be.an.Object();
        should(image).have.properties('body', 'metadata');
        should(image.body).be.equal(data);
        should(image.metadata).be.an.Object();
        should(image.metadata).have.properties(
          'format',
          'width',
          'height',
          'space',
          'channels',
          'depth',
          'density'
        );

        done();
      });
    });
  });

  it('meta (error)', (done) => {
    sandbox.stub(pino, 'error').callsFake((error) => {
      should(error).be.an.Object();
      should(error).have.properties('message');
      should(error.message).be.equal('Input file is missing or of an unsupported image format');

      done();
    });

    const stream = meta();
    should(stream).be.an.Object();
    should(stream).have.properties('_transform');
    stream.end({ body: 'Invalid image.' });
    stream.on('error', (error) => {
      should(error).be.an.Object();
    });
  });
};
