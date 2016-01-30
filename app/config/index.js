'use strict';


let env = function env(variableName) {
    return process.env[variableName];
};

module.exports = {
    env: env('NODE_ENV'),
    key: env('COMETA_KEY'),
    aws: {
        accessKeyId: env('AWS_ACCESS_KEY'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        bucket: env('AWS_BUCKET')
    }
};
