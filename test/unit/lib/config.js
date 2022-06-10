const should = require('should');
const config = require('../../../app/config');

module.exports = () => {
  beforeEach(() => {});
  afterEach(() => {});

  it('Basic.', (done) => {
    should(config).be.an.Object();
    const { app, cometa, formats, log } = config;

    should(app).be.an.Object().with.properties('env', 'port', 'cluster');

    should(cometa)
      .be.an.Object()
      .with.properties('key', 'allowUnauthorized', 'requestTimeout', 'aws');
    should(cometa.aws)
      .be.an.Object()
      .with.properties('accessKeyId', 'secretAccessKey', 'region', 'bucket');

    should(formats).be.an.Object().with.properties('input', 'output');
    should(formats.input).be.an.Array();
    should(formats.input).have.length(5);

    should(formats.output).be.an.Array();
    should(formats.output).have.length(5);

    should(log).be.an.Object().with.properties('name', 'level');
    should(log.name).equal('COMETA');
    should(log.level).equal('warn');

    done();
  });
};
