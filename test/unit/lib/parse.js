const should = require('should');
const parse = require('../../../app/lib/parse');

module.exports = () => {
  it('Parse (with query)', (done) => {
    const result = parse({
      pathname: 'http://localhost/img/test.jpg',
      query: { w: 10, h: 10, q: 75 },
      params: { provider: 'url' }
    });

    should(result).be.an.Object();
    should(result).have.properties('output', 'provider', 'input');
    should(result.output).be.an.Object();
    should(result.output).have.properties('width', 'height', 'quality', 'extension');
    should(result.output.width).be.a.Number();
    should(result.output.width).be.equal(10);
    should(result.output.height).be.a.Number();
    should(result.output.height).be.equal(10);
    should(result.output.quality).be.a.Number();
    should(result.output.quality).be.equal(75);
    should(result.output.extension).be.a.String();
    should(result.output.extension).be.equal('jpg');
    should(result.provider).be.a.String();
    should(result.provider).be.equal('URL');
    should(result.input).be.a.String();
    should(result.input).be.equal('http://localhost/img/test.jpg');

    done();
  });

  it('Parse (invalid quality)', (done) => {
    const result = parse({
      pathname: 'http://localhost/img/test.jpg',
      query: {
        w: 10,
        h: 10,
        q: 103
      },
      params: {
        provider: 'url'
      }
    });

    should(result).be.an.Object();
    should(result).have.properties('output', 'provider', 'input');
    should(result.output).be.an.Object();
    should(result.output).have.properties('width', 'height', 'quality', 'extension');
    should(result.output.width).be.a.Number();
    should(result.output.width).be.equal(10);
    should(result.output.height).be.a.Number();
    should(result.output.height).be.equal(10);
    should(result.output.quality).be.a.Number();
    should(result.output.quality).be.equal(80);
    should(result.output.extension).be.a.String();
    should(result.output.extension).be.equal('jpg');
    should(result.provider).be.a.String();
    should(result.provider).be.equal('URL');
    should(result.input).be.a.String();
    should(result.input).be.equal('http://localhost/img/test.jpg');

    done();
  });

  it('Parse (without query)', (done) => {
    const result = parse({
      pathname: 'http://localhost/img/test.jpg',
      query: {},
      params: {
        provider: 'url'
      }
    });

    should(result).be.an.Object();
    should(result).have.properties('output', 'provider', 'input');
    should(result.output).be.an.Object();
    should(result.output).have.properties('width', 'height', 'quality', 'extension');
    should(result.output.width).equal(null);
    should(result.output.height).equal(null);
    should(result.output.quality).be.a.Number();
    should(result.output.quality).be.equal(80);
    should(result.output.extension).be.a.String();
    should(result.output.extension).be.equal('jpg');
    should(result.provider).be.a.String();
    should(result.provider).be.equal('URL');
    should(result.input).be.a.String();
    should(result.input).be.equal('http://localhost/img/test.jpg');

    done();
  });

  it('Parse (without query & without provider)', (done) => {
    const result = parse({
      pathname: 'http://localhost/img/test.jpg',
      query: {},
      params: {}
    });

    should(result).be.an.Object();
    should(result).have.properties('output', 'provider', 'input');
    should(result.output).be.an.Object();
    should(result.output).have.properties('width', 'height', 'quality', 'extension');
    should(result.output.width).equal(null);
    should(result.output.height).equal(null);
    should(result.output.quality).be.a.Number();
    should(result.output.quality).be.equal(80);
    should(result.output.extension).be.a.String();
    should(result.output.extension).be.equal('jpg');
    should(result.provider).be.a.String();
    should(result.provider).be.equal('');
    should(result.input).be.equal('http://localhost/img/test.jpg');

    done();
  });

  it('Parse (input & output extensions)', (done) => {
    const result = parse({
      pathname: 'http://localhost/img/test.jpg.webp',
      query: {},
      params: {}
    });

    should(result).be.an.Object();
    should(result).have.properties('output', 'provider', 'input');
    should(result.output).be.an.Object();
    should(result.output).have.properties('width', 'height', 'quality', 'extension');
    should(result.output.width).equal(null);
    should(result.output.height).equal(null);
    should(result.output.quality).be.a.Number();
    should(result.output.quality).be.equal(80);
    should(result.output.extension).be.a.String();
    should(result.output.extension).be.equal('webp');
    should(result.provider).be.a.String();
    should(result.provider).be.equal('');
    should(result.input).be.equal('http://localhost/img/test.jpg');

    done();
  });

  it('Parse (invalid extension)', (done) => {
    const result = parse({
      pathname: 'http://localhost/img/test.jpg.xxx',
      query: {},
      params: {}
    });

    should(result).be.an.Object();
    should(result).have.properties('output', 'provider', 'input');
    should(result.output).be.an.Object();
    should(result.output).have.properties('width', 'height', 'quality', 'extension');
    should(result.output.width).equal(null);
    should(result.output.height).equal(null);
    should(result.output.quality).be.a.Number();
    should(result.output.quality).be.equal(80);
    should(result.output.extension).be.an.Error();
    should(result.output.extension.message).be.a.String();
    should(result.output.extension.message).be.equal('.xxx files are not supported.');
    should(result.provider).be.a.String();
    should(result.provider).be.equal('');
    should(result.input).be.equal('http://localhost/img/test.jpg.xxx');

    done();
  });
};
