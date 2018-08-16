const { env: e } = process;
module.exports = {
  app: {
    env: e.NODE_ENV || 'development',
    port: parseInt(e.COMETA_PORT, 10) || 9090,
    cluster: e.COMETA_CLUSTER === 'true'
  },
  cometa: {
    key: e.COMETA_KEY || 'YOU_SHOULD_SET_A_KEY!',
    allowUnauthorized: e.COMETA_ALLOW_UNAUTHORIZED === 'true',
    requestTimeout: parseInt(e.COMETA_REQUEST_TIMEOUT, 10) || 2000,
    aws: {
      accessKeyId: e.AWS_ACCESS_KEY,
      secretAccessKey: e.AWS_ACCESS_SECRET,
      region: e.AWS_REGION,
      bucket: e.AWS_BUCKET
    }
  },
  formats: {
    input: ['webp', 'png', 'tiff', 'jpeg', 'jpg'],
    output: ['webp', 'png', 'tiff', 'jpeg', 'jpg']
  },
  log: {
    name: e.COMETA_LOG_NAME,
    pretty:
      e.NODE_ENV !== 'production' && e.COMETA_LOG_PRETTY === 'true'
        ? {
            translateTime: true,
            levelFirst: true
          }
        : false,
    level: e.COMETA_LOG_LEVEL
  }
};
