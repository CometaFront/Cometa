/* eslint no-console: 0 */

const should = require('should');
const sinon = require('sinon');
const streams = require('../../../app/lib/streams');

const sandbox = sinon.createSandbox();
module.exports = () => {
  beforeEach(() => {});

  afterEach(() => {
    sandbox.restore();
  });

  it('Streams', (done) => {
    should(streams).be.an.Object();
    should(streams).have.properties('meta', 'resize', 'response');

    done();
  });
};
