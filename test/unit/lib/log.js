const should = require('should');
const sinon = require('sinon');
const log = require('../../../app/lib/log');

const sandbox = sinon.createSandbox();
module.exports = () => {
  beforeEach(() => {});
  afterEach(() => sandbox.restore());

  it('info', (done) => {
    const stub = sandbox.stub(process.stdout, 'write');
    stub.onCall(0).callsFake((message) => {
      const match = message.match(/(LOG)|(\[.*])|(Test info)/g);
      should(match.length).be.equal(3);

      stub.restore();
      done();
    });

    log.info('Test info');
  });

  it('debug', (done) => {
    const stub = sandbox.stub(process.stdout, 'write');
    stub.onCall(0).callsFake((message) => {
      const match = message.match(/(LOG)|(\[.*])|(Test debug)/g);
      should(match.length).be.equal(3);

      stub.restore();
      done();
    });

    log.debug('Test debug');
  });

  it('warn', (done) => {
    sandbox.stub(process.stderr, 'write').callsFake((message) => {
      const match = message.match(/(LOG)|(\[.*])|(Test warn)/g);
      should(match.length).be.equal(3);

      done();
    });

    log.warn('Test warn');
  });

  it('error', (done) => {
    sandbox.stub(process.stderr, 'write').callsFake((message) => {
      const match = message.match(/(LOG)|(\[.*])|(Test error)/g);
      should(match.length).be.equal(3);

      done();
    });

    log.error('Test error');
  });

  it('info (with json)', (done) => {
    const stub = sandbox.stub(process.stdout, 'write');
    stub.onCall(0).callsFake((message) => {
      const match = message.match(/(LOG)|(\[.*])|({(.|\n)*})/g);
      should(match.length).be.equal(3);

      stub.restore();
      done();
    });

    log.info({ name: 'test', description: 'unit' });
  });

  it('error (with json)', (done) => {
    const stub = sandbox.stub(process.stderr, 'write');
    stub.onCall(0).callsFake((message) => {
      const match = message.match(/(LOG)|(\[.*])|({(.|\n)*})/g);
      should(match.length).be.equal(3);

      done();
    });

    log.error({ name: 'test', description: 'unit' });
  });

  it('error (with error)', (done) => {
    const stub = sandbox.stub(process.stderr, 'write');
    stub.onCall(0).callsFake((message) => {
      const match = message.match(/(LOG)|(\[.*])|(Error: This is a test error.)/g);
      should(match.length).be.equal(3);

      done();
    });

    log.error(new Error('This is a test error.'));
  });
};
