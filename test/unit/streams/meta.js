const fs = require('fs');
const sinon = require('sinon');
const should = require('should');
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
      should(stream)
        .be.an.Object()
        .with.property('_transform');

      stream.end({ body: data });
      stream.on('data', (image) => {
        should(image)
          .be.an.Object()
          .with.properties('body', 'metadata');

        should(image.body).equal(data);
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
    sandbox.stub(process.stderr, 'write').callsFake((error) => {
      const match = error.match(/(COMETA)|(\[.*])|(Input file is missing)/g);
      should(match[0]).equal('COMETA');
      should(match[2]).equal('Input file is missing');

      done();
    });

    const stream = meta();
    should(stream)
      .be.an.Object()
      .with.property('_transform');

    stream.end({ body: 'Invalid image.' });
    stream.on('error', (error) => {
      should(error).be.an.Object();
    });
  });
};
