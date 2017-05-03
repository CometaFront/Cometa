'use strict';


const fs = require('fs');

module.exports = express => {

    let router = express.Router();
    fs.readdirSync(`${__dirname}/routes/`).forEach(file => {
        if (file.match(/(.+)\.js$/)) {
            try {
                router = require(`./routes/${file}`)(router, _require(`controllers/${file}`));
            } catch (error) {
                console.error(`Can't load the ${file} controller: ${error}`);
            }
        }
    });

    return router;
};
