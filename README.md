<div align="center">
  <img src="https://raw.githubusercontent.com/CometaFront/Assets/master/Images/Cover.png" alt="Cometa" />

[![CodeFactor](https://www.codefactor.io/repository/github/cometafront/cometa/badge)](https://www.codefactor.io/repository/github/cometafront/cometa)
[![Codacy](https://api.codacy.com/project/badge/Grade/9813c362ec754cceb759888d891f3bf6)](https://www.codacy.com/app/CometaFront/Cometa?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=CometaFront/Cometa&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/9813c362ec754cceb759888d891f3bf6)](https://www.codacy.com/app/CometaFront/Cometa?utm_source=github.com&utm_medium=referral&utm_content=CometaFront/Cometa&utm_campaign=Badge_Coverage)
[![Build Status](https://travis-ci.org/CometaFront/Cometa.svg?branch=master)](https://travis-ci.org/CometaFront/Cometa)
[![Known Vulnerabilities](https://snyk.io/test/github/CometaFront/Cometa/badge.svg?targetFile=package.json)](https://snyk.io/test/github/CometaFront/Cometa?targetFile=package.json)
[![Greenkeeper badge](https://badges.greenkeeper.io/CometaFront/Cometa.svg)](https://greenkeeper.io/)

</div>

Super fast, on-demand and on-the-fly, image processing.


### Requirements

`Cometa` uses [sharp](https://github.com/lovell/sharp) for image manipulation.<br />


### Installation

- Clone this repository (navigate to its location),
- copy the `.env.example` to `.env` and fill the required values,
- install what is needed: `npm i`,
- test: `npm test`,
- run: `npm start`

`Cometa` should now be running on the specified port.


#### Environment variables

- `COMETA_CLUSTER`: Whether the application should make use of all available CPUs or not.
- `COMETA_PORT`: Port on which your application will listen. `Defaults to 9090`.
- `COMETA_KEY`: A unique key used for request signature validation.
- `COMETA_ALLOW_UNAUTHORIZED`: Whether unsigned requests are allowed or not.
- `COMETA_REQUEST_TIMEOUT`: (milliseconds) before timing out URL image requests.
- `COMETA_LOG_NAME`: The name for your logs (if enabled). `Defaults to 'Cometa'`.
- `COMETA_LOG_LEVEL`: The minimal level at which to log. See [pino's log levels](https://github.com/pinojs/pino/blob/master/docs/api.md#level-string) `Defaults to 'info'`

##### If using with S3:
- `AWS_ACCESS_KEY`: Your AWS access key.
- `AWS_ACCESS_SECRET`: Your AWS access secret.
- `AWS_BUCKET`: The name of your S3 bucket.
- `AWS_REGION`: Your AWS service region.


### Usage
#### With S3

If, for example, in your `AWS_BUCKET` bucket, you have a folder named `cometa` with an image called `superlight.jpg`, your request will be:

```
GET /s3/cometa/superlight.jpg
```

#### With a URL

Just provide the `URL` of the image you are requesting:

```
GET /url/http://images.google.com/cars.jpg
```

#### Query parameters

- `w` || `width`: (*integer*) Output width,
- `h` || `height`: (*integer*) Output height,
- `q` || `quality`: (*integer*) Output image quality. Defaults to `80`, ignored on `png` output.


#### Input formats

Supported input formats are: `webp`, `png`, `tiff` and `jpeg` (aka `jpg`).


#### Output formats

Supported output formats are: `webp`, `png`, `tiff`, and `jpeg` (aka `jpg`).

Simply append the required output format to URL:

```
GET /s3/cometa/superlight.jpg.webp
GET /url/http://images.google.com/cars.jpg.webp
// Outputs webp

GET /s3/cometa/superlight.jpg.png
GET /url/url=http://images.google.com/cars.jpg.png
// Outputs png
```


### Authentication

Take, for example:

```
GET /s3/cometa/superlight.jpg?width=200&height=200
```

Malicious users could easily overload your server by making thousands of consecutive requests with varying widths and heights.

Luckily, `Cometa` provides a way of authenticating the request -and we strongly recommend you use it.

Authenticate your request by computing a `SHA-1 hmac` signature, with your `COMETA_KEY` and pass it to the request.


#### Signature generation

```js
const url = '/s3/cometa/superlight.jpg?width=200&height=200';
const signature = crypto
  .createHmac('sha1', COMETA_KEY)
  .update(url)
  .digest('hex');
```

You may pass the signature as a query parameter:

```
GET /s3/cometa/superlight.jpg?width=200&height=200&authorization=[signature]
```

or as a HTTP header:
```js
headers {
  'Authorization': [signature]
}
```

**Note:** Allowing unsigned requests can be dangerous. *Use at your own discretion*


### Take it for a spin
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)


### Contribute
```
fork https://github.com/CometaFront/Cometa/
```


### License

[MIT](https://github.com/CometaFront/Cometa/blob/master/LICENSE)

