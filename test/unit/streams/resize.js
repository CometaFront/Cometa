const should = require('should');
const resize = require('../../../app/streams/resize');

module.exports = () => {
  it('Resize', (done) => {
    should(resize).be.a.Function();

    done();
  });
};
