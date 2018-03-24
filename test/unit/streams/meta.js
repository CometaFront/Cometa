const should = require('should');
const meta = require('../../../app/streams/meta');

module.exports = () => {
  it('Meta', (done) => {
    should(meta).be.a.Function();

    done();
  });
};
