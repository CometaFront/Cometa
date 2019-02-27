const should = require('should');

module.exports = () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../../../app/config')];
  });
  afterEach(() => {});

  it('Basic.', (done) => {
    process.env.COMETA_LOG_NAME = 'TEST_NAME';
    process.env.COMETA_LOG_LEVEL = 'TEST_LEVEL';
    const config = require.call(null, '../../../app/config');

    should(config).be.an.Object();
    const { app, cometa, formats, log } = config;

    should(app)
      .be.an.Object()
      .with.properties('env', 'port', 'cluster');

    should(cometa)
      .be.an.Object()
      .with.properties('key', 'allowUnauthorized', 'requestTimeout', 'aws');
    should(cometa.aws)
      .be.an.Object()
      .with.properties('accessKeyId', 'secretAccessKey', 'region', 'bucket');

    should(formats)
      .be.an.Object()
      .with.properties('input', 'output');
    should(formats.input).be.an.Array();
    should(formats.input).have.length(5);

    should(formats.output).be.an.Array();
    should(formats.output).have.length(5);

    should(log)
      .be.an.Object()
      .with.properties('name', 'level');
    should(log.name).be.equal('TEST_NAME');
    should(log.level).be.equal('TEST_LEVEL');

    done();
  });
};
