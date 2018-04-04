const should = require('should');
const sinon = require('sinon');
const fake = require('../support/fake');
const pino = require('../../../app/lib/pino');
const router = require('../../../app/lib/router');

const sandbox = sinon.createSandbox();
module.exports = () => {
  beforeEach(() => {
    sandbox.spy(router, 'route');
    sandbox.spy(router, 'process');
    sandbox.spy(router, 'getParams');
  });

  afterEach(() => {
    router.routes = {};
    delete router.req;
    sandbox.restore();
  });

  it('Router', (done) => {
    should(router).be.an.Object();
    should(router).have.properties('routes');
    should(router.routes).be.an.Object();

    done();
  });

  it('Router (GET)', (done) => {
    router.get('/', (req, res) => ({ req, res }));

    sinon.assert.calledOnce(router.route);
    sinon.assert.notCalled(router.process);
    sinon.assert.notCalled(router.getParams);

    should(router).be.an.Object();
    should(router).have.properties('routes');
    should(router.routes).be.an.Object();
    should(router.routes).have.properties('get');
    should(router.routes.get).be.an.Array();
    should(router.routes.get).have.length(1);

    done();
  });

  it('Process (GET / No routes)', (done) => {
    sandbox.stub(pino, 'warn').callsFake((error) => {
      sinon.assert.notCalled(router.route);
      sinon.assert.calledOnce(router.process);
      sinon.assert.notCalled(router.getParams);

      should(router).be.an.Object();
      should(router).have.properties('routes');
      should(router.routes).be.an.Object();
      should(Object.keys(router.routes).length).be.equal(0);
      should(router.req).be.an.Object();
      should(router.req.path).be.a.String();
      should(router.req.path).be.equal('/url/http://localhost:9090/car.png');
      should(error).be.a.String();
      should(error).be.equal('No routes for this method were found.');

      done();
    });

    router.process(fake.req(), fake.res());
  });

  it('Process (GET / Page not found)', (done) => {
    sandbox.stub(pino, 'warn').callsFake((error) => {
      sinon.assert.calledOnce(router.route);
      sinon.assert.calledOnce(router.process);
      sinon.assert.notCalled(router.getParams);

      should(router).be.an.Object();
      should(router).have.properties('routes');
      should(router.routes).be.an.Object();
      should(router.routes).have.properties('get');
      should(router.routes.get).be.an.Array();
      should(router.routes.get).have.length(1);
      should(router.req).be.an.Object();
      should(router.req.path).be.a.String();
      should(router.req.path).be.equal('/url/http://localhost:9090/car.png');
      should(error).be.a.String();
      should(error).be.equal('Page not found.');

      done();
    });

    router.get('/', (req, res) => ({ req, res }));
    router.process(fake.req(), fake.res());
  });

  it('Process (GET)', (done) => {
    router.get('/:provider/(.*)', (req, res) => ({ req, res }));
    router.process(fake.req(), fake.res());

    sinon.assert.calledOnce(router.route);
    sinon.assert.calledOnce(router.process);
    sinon.assert.calledOnce(router.getParams);

    should(router).be.an.Object();
    should(router).have.properties('routes');
    should(router.routes).be.an.Object();
    should(router.routes).have.properties('get');
    should(router.routes.get).be.an.Array();
    should(router.routes.get).have.length(1);
    should(router.req).be.an.Object();
    should(router.req.path).be.a.String();
    should(router.req.path).be.equal('http://localhost:9090/car.png');

    done();
  });

  it('Process (GET / with next)', (done) => {
    router.get('/:provider/(.*)', (req, res, next) => next(), (req, res) => ({ req, res }));
    router.process(fake.req(), fake.res());

    sinon.assert.calledOnce(router.route);
    sinon.assert.calledOnce(router.process);
    sinon.assert.calledOnce(router.getParams);

    should(router).be.an.Object();
    should(router).have.properties('routes');
    should(router.routes).be.an.Object();
    should(router.routes).have.properties('get');
    should(router.routes.get).be.an.Array();
    should(router.routes.get).have.length(1);
    should(router.req).be.an.Object();
    should(router.req.path).be.a.String();
    should(router.req.path).be.equal('http://localhost:9090/car.png');

    done();
  });

  it('Process (GET / without next)', (done) => {
    sandbox.stub(pino, 'warn').callsFake((error) => {
      sinon.assert.calledOnce(router.route);
      sinon.assert.calledOnce(router.process);
      sinon.assert.calledOnce(router.getParams);

      should(router).be.an.Object();
      should(router).have.properties('routes');
      should(router.routes).be.an.Object();
      should(router.routes).have.properties('get');
      should(router.routes.get).be.an.Array();
      should(router.routes.get).have.length(1);
      should(router.req).be.an.Object();
      should(router.req.path).be.a.String();
      should(router.req.path).be.equal('http://localhost:9090/car.png');
      should(error).be.a.String();
      should(error).be.equal('Nothing left in the stack.');

      done();
    });

    router.get('/:provider/(.*)', (req, res, next) => next());
    router.process(fake.req(), fake.res());
  });

  it('Process (GET / multiple routes)', (done) => {
    router.get('/unit/test', (req, res) => ({ req, res }));
    router.get('/:provider/(.*)', (req, res) => ({ req, res }));
    router.process(fake.req(), fake.res());

    sinon.assert.calledTwice(router.route);
    sinon.assert.calledOnce(router.process);
    sinon.assert.calledOnce(router.getParams);

    should(router).be.an.Object();
    should(router).have.properties('routes');
    should(router.routes).be.an.Object();
    should(router.routes).have.properties('get');
    should(router.routes.get).be.an.Array();
    should(router.routes.get).have.length(2);
    should(router.req).be.an.Object();
    should(router.req.path).be.a.String();
    should(router.req.path).be.equal('http://localhost:9090/car.png');

    done();
  });

  it('Router send error', (done) => {
    sandbox.stub(pino, 'warn').callsFake((error) => {
      sinon.assert.notCalled(router.route);
      sinon.assert.notCalled(router.process);
      sinon.assert.notCalled(router.getParams);

      should(router).be.an.Object();
      should(router).have.properties('routes');
      should(router.routes).be.an.Object();
      should(Object.keys(router.routes).length).be.equal(0);
      should(router.statusCode).be.a.Number();
      should(router.statusCode).be.equal(503);
      should(error).be.a.String();
      should(error).be.equal('Unit test error.');

      done();
    });

    router.sendError(503, 'Unit test error.');
  });

  /**
   * @TODO -Request body support, in parse()
   */
  it('Router (POST)', (done) => {
    router.post('/', (req, res) => ({ req, res }));

    should(router).be.an.Object();
    should(router).have.properties('routes');
    should(router.routes).be.an.Object();
    should(router.routes).have.properties('post');
    should(router.routes.post).be.an.Array();
    should(router.routes.post).have.length(1);
    // should(router.req).be.an.Object();
    // should(router.req.path).be.a.String();
    // should(router.req.path).be.equal('http://localhost:9090/car.png');

    done();
  });
};
