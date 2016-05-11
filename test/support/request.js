'use strict';


let util = require('util'),
    req = require('request'),
    colors = require('colors'),
    crypto = require('crypto'),
    expect = require('chai').expect,
    request = {

        signature: (verb, uri, body, session) => {

            if (!session) {
                return '';
            }

            uri = '/v1' + uri;
            let md5Checksum,
                signatureString,
                signature;

            md5Checksum = crypto.createHash('md5').update((body ? JSON.stringify(body) : uri), 'utf-8').digest('hex');
            signatureString = util.format('%s.%s.%s.%s', verb, uri, md5Checksum, global.test.time);
            signature = crypto.createHmac('sha256', session.secret).update(signatureString).digest('base64');

            return session.token + global.test.time + signature;
        },

        make: params => {

            return new Promise((yes, no) => {
                let options = {
                    method: params.method,
                    uri: params.uri || request.apiUrl + params.path
                };

                if (params.external) {
                    options.body = params.body;
                } else {
                    if (['PUT', 'POST'].indexOf(params.method) >= 0 && params.body) {
                        options.json = params.body;
                    } else if (['PUT', 'POST'].indexOf(params.method) < 0) {
                        options.json = true;
                    }
                }

                /**
                 * In case the request requires authorization
                 */
                if (params.session) {
                    options.headers = {
                        'Authorization': request.signature(params.method, params.path, params.body, params.session)
                    };
                }

                req(options, (error, response, body) => {

                    let verbose = body && body.message ? colors.red.underline(body.message) + '  ' + params.method + ' ' + params.path.white : '';
                    expect(response.statusCode).to.be.eql(params.expectedStatusCode || 200, verbose);
                    if (error) {
                        return no(error);
                    }

                    yes(body);
                });
            });
        }

    };

module.exports = apiUrl => {

    request.apiUrl = apiUrl;
    return request.make;
};
