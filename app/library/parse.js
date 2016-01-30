'use strict';


module.exports = function (req) {

    let supportedFormats = ['webp', 'png', 'jpeg'],
        format = req.query.f || req.query.format || null,
        quality = parseInt(req.query.q || req.query.quality) || 80;

    format = supportedFormats.indexOf(format) >= 0 ? format : 'webp';
    quality = quality <= 100 ? quality : 80;

    return {
        output: {
            width: parseInt(req.query.w || req.query.width) || 0,
            height: parseInt(req.query.h || req.query.height) || 0,
            quality: quality,
            format: format
        },
        imagePath: req.params[0] || null
    };
};
