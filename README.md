<p align="center">
  <img src="https://raw.githubusercontent.com/CometaFront/Assets/master/Images/Cover.png" alt="Cometa" />
</p>

[![codebeat badge](https://codebeat.co/badges/f6086240-7e21-4dad-930b-51384ac1f69a)](https://codebeat.co/projects/github-com-cometafront-cometa-master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9813c362ec754cceb759888d891f3bf6)](https://www.codacy.com/app/aichholzer/Cometa?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=CometaFront/Cometa&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/de955dab2112431e84ba/maintainability)](https://codeclimate.com/github/CometaFront/Cometa/maintainability)
[![NSP Status](https://nodesecurity.io/orgs/cometa/projects/55b14b29-b6f7-4b99-be1a-39afc5c9ca05/badge)](https://nodesecurity.io/orgs/cometa/projects/55b14b29-b6f7-4b99-be1a-39afc5c9ca05)
[![Build Status](https://travis-ci.org/CometaFront/Cometa.svg?branch=master)](https://travis-ci.org/CometaFront/Cometa)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Super fast, on-demand and on-the-fly, image processing.

```
WOP. Ask if you need help.
```


### Requirements

`Cometa` uses [sharp](https://github.com/lovell/sharp) for image manipulation.<br />
In order to install `sharp` you will need to make sure all dependencies are satisfied. See its [installation instructions](http://sharp.dimens.io/en/stable/install/).



### Installation

- Clone this repository (navigate to its location),
- copy the `.env.example` to `.env` and fill the required values,
- install what is needed: `npm install`,
- run the application (with grunt): `grunt nodemon`

**Cometa** should now be running on the specified port.


#### Environment variables

Defined in your `.env` file or locally exported:

- `APP_CLUSTER`: Whether the application should make use of all available CPUs or not.
- `PORT`: Port on which your application will listen. `Defaults to 5050`.
- `COMETA_KEY`: A unique key used for request signature validation.
- `NOAUTH_ALLOWED`: Whether `noauth` requests are allowed or not.
- `REQUEST_TIMEOUT`: When using with an image URL, the time (in milliseconds) before timing out.

##### If using with S3:
- `AWS_ACCESS_KEY`: Your AWS access key.
- `AWS_ACCESS_SECRET`: Your AWS access secret.
- `AWS_REGION`: Region of your S3 bucket.
- `AWS_BUCKET`: Name of your S3 bucket.


### Usage
#### With S3

If, for example, inside your `AWS_BUCKET` bucket, you have a folder named `cometa` holding an image named `superlight.jpg`, your request will be:

```
GET http://localhost:5050/noauth/cometa/superlight.jpg
```

#### With a URL

Just provide the `URL` of the image you are requesting:

```
GET http://localhost:5050/noauth/?url=http://images.google.com/cars.jpg
```

#### Query parameters

- `w` || `width`: (*integer*) Output width,
- `h` || `height`: (*integer*) Output height,
- `q` || `quality`: (*integer*) Output image quality. Defaults to `80`, ignored on `png` output,
- `f` || `filter`: (*string, comma separated filters*) Filters to be applied to the image,
- `url`: (*string*) Image URL being requested.


#### Input formats

Supported input formats are: `webp`, `png`, `tiff` and `jpeg` (aka `jpg`).


#### Output formats

Supported output formats are: `webp`, `png`, `tiff`, and `jpeg` (aka `jpg`).

Simply append the required output format to URL:

```
GET http://localhost:5050/noauth/cometa/superlight.jpg.webp
// Outputs webp

GET http://localhost:5050/noauth/cometa/superlight.jpg.png
// Outputs png
```

When using an image `URL`, you may specify the output format in your request's URL:

```
GET http://localhost:5050/noauth/.webp?url=http://images.google.com/cars.jpg
// Outputs webp

GET http://localhost:5050/noauth/.png?url=http://images.google.com/cars.jpg
// Outputs png
```


### Authentication

Look at this URL:

```
http://localhost:5050/noauth/cometa/superlight.jpg?width=200&height=200
```

Malicious users could easily overload your server by making thousands of consecutive requests with varying widths and heights.

To prevent this, **Cometa** provides a way of authenticating any request -and we strongly recommend you use it.

In order to authenticate a request you must compute a `SHA-1 hmac` signature and include it in the request URL.


#### Signature generation

Her's an example request URL:

```
http://localhost:5050/[signature]/cometa/superlight.jpg?width=200&height=200
```
**Note:** At this point `[signature]` is only a placeholder.

In order to generate a valid signature you will need:

- The hostname: `localhost:5050`,
- and the query string: `/cometa/superlight.jpg?width=200&height=200`

The URL to be signed will be: `localhost:5050/cometa/superlight.jpg?width=200&height=200`.

- Generate a `SHA-1 hmac` of this URL using your `COMETA_KEY` key,
- encode your signature to `hexadecimal`.

The signature must be passed in the URL.<br />
Place it between the `hostname` and the `query string` (instead of the `[signature]` in the example above). You signed URL will look something like this:

```
http://localhost:5050/a9c619705e8fcaa770885cac1837ae950f5c8ba5/cometa/superlight.jpg?width=200&height=200
```

**Note:** Allowing `noauth` requests can be dangerous. *Use at your own discretion*


### Take it for a spin
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)


### Contribute
```
fork https://github.com/aichholzer/Cometa/
```


### License

[MIT](https://github.com/aichholzer/Cometa/blob/master/LICENSE)

