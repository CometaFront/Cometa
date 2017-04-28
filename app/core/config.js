'use strict';


module.exports = {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV,
    key: process.env.COMETA_KEY,
    cluster: process.env.APP_CLUSTER === 'true' || false,
    noAuthAllowed: process.env.NOAUTH_ALLOWED === 'true' || false,
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 2500,
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_ACCESS_SECRET,
        region: process.env.AWS_REGION,
        bucket: process.env.AWS_BUCKET,
        signatureVersion: process.env.AWS_SIGNATURE || 'v4'
    }
};
