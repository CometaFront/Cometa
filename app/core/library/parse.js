'use strict';


const url = require('url');
const path = require('path');

module.exports = req => {

    const supportedInput = ['webp', 'png', 'tiff', 'jpeg', 'jpg'];
    const supportedOutput = ['webp', 'png', 'tiff', 'jpeg'];
    const outputQuality = parseInt(req.query.q || req.query.quality);
    let inputURL = '';
    let provider = null;

    if (req.query.url) {
        inputURL = req.query.url;
        provider = 'HTTP';
    } else {
        inputURL = req.params[0];
        provider = 'S3';
    }

    const imagePath = url.parse(inputURL);
    const fileName = path.basename(imagePath.pathname).split('.');
    let outputExtension = fileName.pop();
    let inputExtension = fileName.pop();

    if (supportedInput.indexOf(outputExtension) >= 0) {
        let removedExtension = outputExtension;
        outputExtension = (supportedOutput.indexOf(outputExtension) < 0) ? 'jpeg' : outputExtension;
        inputURL = supportedInput.indexOf(inputExtension) >= 0 ? inputURL.replace('.' + removedExtension, '') : inputURL;
    } else if (supportedInput.indexOf(outputExtension) < 0) {
        throw {
            status: 400,
            message: `I can't handle .${outputExtension} files.`
        };
    }

    return {
        output: {
            width: parseInt(req.query.w || req.query.width) || null,
            height: parseInt(req.query.h || req.query.height) || null,
            filter: req.query.f || req.query.filter || null,
            quality: outputQuality > 0 && outputQuality <= 100 ? outputQuality : 80,
            extension: outputExtension
        },
        inputURL: inputURL || null,
        provider: provider
    };
};
