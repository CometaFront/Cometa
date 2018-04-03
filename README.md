<p align="center">
  <img src="https://raw.githubusercontent.com/CometaFront/Assets/master/Images/Cover.png" alt="Cometa" />
</p>

[![codebeat badge](https://codebeat.co/badges/f6086240-7e21-4dad-930b-51384ac1f69a)](https://codebeat.co/projects/github-com-cometafront-cometa-master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9813c362ec754cceb759888d891f3bf6)](https://www.codacy.com/app/CometaFront/Cometa?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=CometaFront/Cometa&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/9813c362ec754cceb759888d891f3bf6)](https://www.codacy.com/app/aichholzer/Cometa?utm_source=github.com&utm_medium=referral&utm_content=CometaFront/Cometa&utm_campaign=Badge_Coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/de955dab2112431e84ba/maintainability)](https://codeclimate.com/github/CometaFront/Cometa/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/CometaFront/Cometa/badge.svg?branch=master)](https://coveralls.io/github/CometaFront/Cometa?branch=master)
[![NSP Status](https://nodesecurity.io/orgs/cometa/projects/55b14b29-b6f7-4b99-be1a-39afc5c9ca05/badge)](https://nodesecurity.io/orgs/cometa/projects/55b14b29-b6f7-4b99-be1a-39afc5c9ca05)
[![Build Status](https://travis-ci.org/CometaFront/Cometa.svg?branch=master)](https://travis-ci.org/CometaFront/Cometa)
[![Greenkeeper badge](https://badges.greenkeeper.io/CometaFront/Cometa.svg)](https://greenkeeper.io/)


Super fast, on-demand and on-the-fly, image processing.

```
WOP. Ask if you need help.
```


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

- `APP_CLUSTER`: Whether the application should make use of all available CPUs or not.
- `PORT`: Port on which your application will listen. `Defaults to 9090`.
- `COMETA_KEY`: A unique key used for request signature validation.
- `ALLOW_UNAUTHORIZED`: Whether unsigned requests are allowed or not.
- `REQUEST_TIMEOUT`: (milliseconds) before timing out URL image requests.

##### If using with S3:
- `AWS_ACCESS_KEY`: Your AWS access key.
- `AWS_ACCESS_SECRET`: Your AWS access secret.
- `AWS_BUCKET`: Name of your S3 bucket.


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
GET /s3/cometa/superlight.jpg?width=200&height=200&auth=[signature]
```

or as a HTTP header:
```js
headers {
  'auth': [signature]
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

