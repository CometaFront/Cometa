const { Readable, Transform } = require('stream');

class Response extends Transform {
  constructor() {
    super();

    this.writeHead = () => {};
    this.write = () => {};
    this.end = () => {};
    this.setEncoding = () => {};
    this.statusCode = 200;

    Object.assign(
      this,
      new Readable({
        read() {
          this.push('Binary image data will be here.');
          return this.push(null);
        }
      })
    );
  }
}

module.exports = {
  req: () => ({
    headers: {
      host: 'localhost:9090',
      'accept-encoding': 'gzip, deflate'
    },
    url: 'http://localhost:9090/car.png',
    method: 'GET'
  }),
  res: () => new Response()
};
