const should = require('should');

module.exports = () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../../../app/config')];
  });
  afterEach(() => {});

  it('With pretty logs.', (done) => {
    process.env.COMETA_LOG_LEVEL = 'TEST_LEVEL';
    process.env.COMETA_LOG_NAME = 'TEST_NAME';
    const config = require.call(null, '../../../app/config');

    should(config).be.an.Object();
    should(config.app).be.an.Object();
    should(config.cometa).be.an.Object();
    should(config.log).be.an.Object();
    should(config.log.name).be.equal('TEST_NAME');
    should(config.log.level).be.equal('TEST_LEVEL');

    done();
  });
};
