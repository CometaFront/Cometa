module.exports = {
  app: {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    key: process.env.COMETA_KEY,
    useCluster: process.env.APP_CLUSTER === 'true' || false,
  },
  cometa: {
    allowUnauthorized: process.env.NOAUTH_ALLOWED === 'true' || false,
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10) || 2500,
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_ACCESS_SECRET,
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET,
      signatureVersion: process.env.AWS_SIGNATURE || 'v4'
    }
  }
};
