'use strict';


/**
 * @TODO: Remove express, run it on plain Node.
 */
const express = require('express');
const favicon = require('serve-favicon');
const app = express();
const port = 10000;

app.use(
    express.static(`${__dirname}/support`),
    favicon(`${__dirname}/../app/public/favicon.png`)
);

app.listen(port, () => console.log(`Up: ${port}`));
