'use strict';


module.exports = function (req) {

    let supportedInput = ['webp', 'png', 'jpeg', 'jpg'],
        supportedOutput = ['webp', 'png', 'jpeg'],
        path = req.params[0],
        imageParts = path.split('/').pop().split('.');

    // TODO: Error on invalid input - imageParts[1]

    let outputFormat = 'jpeg';
    if (imageParts[2] && supportedOutput.indexOf(imageParts[2]) >= 0) {
        outputFormat = imageParts[2];
        path = path.replace('.' + outputFormat, '');
    }

    let outputQuality = parseInt(req.query.q || req.query.quality);
    outputQuality = outputQuality > 0 && outputQuality <= 100 ? outputQuality : 80;

    return {
        output: {
            width: parseInt(req.query.w || req.query.width) || 0,
            height: parseInt(req.query.h || req.query.height) || 0,
            quality: outputQuality,
            format: outputFormat
        },
        imagePath: path || null
    };
};
