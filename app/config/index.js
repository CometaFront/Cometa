'use strict';


let env = variableName => {

    let variable = process.env[variableName] || '';
    if (variable.toLowerCase() === 'false' || variable.toLowerCase() === 'no') {
        variable = false;
    }

    return variable;
};

module.exports = {
    env: env('NODE_ENV'),
    key: env('COMETA_KEY'),
    cluster: env('APP_CLUSTER'),
    noAuthAllowed: env('NOAUTH_ALLOWED'),
    aws: {
        accessKeyId: env('AWS_ACCESS_KEY'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        bucket: env('AWS_BUCKET')
    }
};
