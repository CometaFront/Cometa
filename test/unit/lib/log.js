const should = require('should');
const sinon = require('sinon');

let log;
const sandbox = sinon.createSandbox();
module.exports = () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../../../app/lib/log')];
    delete require.cache[require.resolve('../../../app/config')];
  });
  afterEach(() => sandbox.restore());

  it('info', (done) => {
    process.env.COMETA_LOG_LEVEL = 'info';
    log = require.call(null, '../../../app/lib/log');

    const stub = sandbox.stub(process.stdout, 'write');
    stub.onCall(0).callsFake((message) => {
      const match = message.match(/(COMETA)|(\[.*])|(Test info)/g);
      should(match[0]).equal('COMETA');
      should(match[2]).equal('Test info');
      should(stub.calledOnce).be.true();

      stub.restore();
      done();
    });

    log.info('Test info');
  });

  it('debug', (done) => {
    process.env.COMETA_LOG_LEVEL = 'debug';
    log = require.call(null, '../../../app/lib/log');

    const stub = sandbox.stub(process.stdout, 'write');
    stub.onCall(0).callsFake((message) => {
      const match = message.match(/(COMETA)|(\[.*])|(Test debug)/g);
      should(match[0]).equal('COMETA');
      should(match[2]).equal('Test debug');
      should(stub.calledOnce).be.true();

      stub.restore();
      done();
    });

    log.debug('Test debug');
  });

  it('warn', (done) => {
    process.env.COMETA_LOG_LEVEL = 'warn';
    log = require.call(null, '../../../app/lib/log');

    const stub = sandbox.stub(process.stderr, 'write');
    stub.callsFake((message) => {
      const match = message.match(/(COMETA)|(\[.*])|(Test warn)/g);
      should(match[0]).equal('COMETA');
      should(match[2]).equal('Test warn');
      should(stub.calledOnce).be.true();

      done();
    });

    log.warn('Test warn');
  });

  it('error', (done) => {
    process.env.COMETA_LOG_LEVEL = 'error';
    log = require.call(null, '../../../app/lib/log');

    const stub = sandbox.stub(process.stderr, 'write');
    stub.callsFake((message) => {
      const match = message.match(/(COMETA)|(\[.*])|(Test error)/g);
      should(match[0]).equal('COMETA');
      should(match[2]).equal('Test error');
      should(stub.calledOnce).be.true();

      done();
    });

    log.error('Test error');
  });

  it('info (with json)', (done) => {
    process.env.COMETA_LOG_LEVEL = 'info';
    log = require.call(null, '../../../app/lib/log');

    const stub = sandbox.stub(process.stdout, 'write');
    stub.onCall(0).callsFake((message) => {
      const match = message.match(/(COMETA)|(\[.*])|({(.|\n)*})/g);
      should(match[0]).equal('COMETA');
      should(match[2]).equal(JSON.stringify({ name: 'test', description: 'unit' }, null, 2));
      should(stub.calledOnce).be.true();

      stub.restore();
      done();
    });

    log.info({ name: 'test', description: 'unit' });
  });

  it('error (with json)', (done) => {
    process.env.COMETA_LOG_LEVEL = 'error';
    log = require.call(null, '../../../app/lib/log');

    const stub = sandbox.stub(process.stderr, 'write');
    stub.onCall(0).callsFake((message) => {
      const match = message.match(/(COMETA)|(\[.*])|({(.|\n)*})/g);
      should(match[0]).equal('COMETA');
      should(match[2]).equal(JSON.stringify({ name: 'test', description: 'unit' }, null, 2));
      should(stub.calledOnce).be.true();

      done();
    });

    log.error({ name: 'test', description: 'unit' });
  });

  it('error (with error)', (done) => {
    process.env.COMETA_LOG_LEVEL = 'error';
    log = require.call(null, '../../../app/lib/log');

    const stub = sandbox.stub(process.stderr, 'write');
    stub.onCall(0).callsFake((message) => {
      const match = message.match(/(COMETA)|(\[.*])|(Error: This is a test error.)/g);
      should(match[0]).equal('COMETA');
      should(match[2]).equal('Error: This is a test error.');
      should(stub.calledOnce).be.true();

      done();
    });

    log.error(new Error('This is a test error.'));
  });

  it('no log (different level)', (done) => {
    process.env.COMETA_LOG_LEVEL = 'warn';
    log = require.call(null, '../../../app/lib/log');

    const stub = sandbox.stub(process.stdout, 'write');
    log.info('Test info');
    should(stub.notCalled).be.true();

    done();
  });
};
