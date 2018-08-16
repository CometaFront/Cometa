const should = require('should');

module.exports = () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../../../app/config')];
  });
  afterEach(() => {});

  it('With pretty logs.', (done) => {
    process.env.COMETA_LOG_LEVEL = 'TEST_LEVEL';
    process.env.COMETA_LOG_NAME = 'TEST_NAME';
    process.env.COMETA_LOG_PRETTY = 'true';
    const config = require.call(null, '../../../app/config');

    should(config).be.an.Object();
    should(config.app).be.an.Object();
    should(config.cometa).be.an.Object();
    should(config.log).be.an.Object();
    should(config.log.name).be.equal('TEST_NAME');
    should(config.log.level).be.equal('TEST_LEVEL');
    should(config.log.pretty).be.an.Object();
    should(config.log.pretty.translateTime).be.equal(true);
    should(config.log.pretty.levelFirst).be.equal(true);

    done();
  });

  it('Without pretty logs (turned off).', (done) => {
    process.env.COMETA_LOG_PRETTY = 'false';
    const config = require.call(null, '../../../app/config');

    should(config).be.an.Object();
    should(config.app).be.an.Object();
    should(config.cometa).be.an.Object();
    should(config.log).be.an.Object();
    should(config.log.pretty).be.equal(false);

    done();
  });

  it('Without pretty logs (production environment).', (done) => {
    process.env.NODE_ENV = 'production';
    process.env.COMETA_LOG_PRETTY = 'true';
    const config = require.call(null, '../../../app/config');

    should(config).be.an.Object();
    should(config.app).be.an.Object();
    should(config.cometa).be.an.Object();
    should(config.log).be.an.Object();
    should(config.log.pretty).be.equal(false);

    done();
  });
};
