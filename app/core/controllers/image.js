const provider = attract('core/lib/provider');
const stream = attract('core/lib/streams');

module.exports = {
  download: (req, res, next) => {
    provider(req, next)
      .pipe(stream.meta(next))
      .pipe(stream.resize(next))
      .pipe(stream.filter(next))
      .pipe(stream.response(res, next));
  }
};
