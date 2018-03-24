const should = require('should');
const response = require('../../../app/streams/response');

module.exports = () => {
  it('Response', (done) => {
    should(response).be.a.Function();

    done();
  });
};
