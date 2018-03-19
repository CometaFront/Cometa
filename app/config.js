module.exports = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 9090,
    useCluster: process.env.APP_CLUSTER === 'true'
  },
  cometa: {
    key: process.env.COMETA_KEY || '',
    allowUnauthorized: process.env.ALLOW_UNAUTHORIZED === 'true',
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10) || 2000,
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_ACCESS_SECRET,
      bucket: process.env.AWS_BUCKET
    }
  },
  log: {
    name: process.env.LOG_NAME,
    prettyPrint: process.env.LOG_PRETTY === 'true',
    level: process.env.LOG_LEVEL
  }
}
