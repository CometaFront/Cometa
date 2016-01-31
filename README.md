<img src="./app/public/cometa.png" width="350">

## Cometa
```
On-demand, on-the-fly, image resizing.
```
*Please note that this is work in progress, just ask if you need help with anything.*



## Requirements

Cometa uses [sharp](https://github.com/lovell/sharp) for super-fast image manipulation. In order to install `sharp` you will need to make sure all dependencies are satisfied. See its [installation instructions](http://sharp.dimens.io/en/stable/install/).



## Installation

- Copy the `.env.example` to `.env` and fill in the required values,
- clone this repository and navigate to its location,
- install what is needed: `npm install`,
- run the application, using grunt: `grunt nodemon`

Your application should now be running on the port you specified in your `.env` file.<br />
Currently it's only possible to fetch images from an `AWS S3` bucket.

#### Environment variables

Defined in your `.env` variable or locally exported.

- `NODE_ENV`: How the application is run, currently has no effect.
- `PORT`: Port on which your application will listen.
- `COMETA_KEY`: A unique key used for authenticated request validation.

- `AWS_ACCESS_KEY`: You AWS access key.
- `AWS_ACCESS_SECRET`: You AWS access secret.
- `AWS_REGION`: Region of your S3 bucket.
- `AWS_BUCKET`: Name of your S3 bucket.



## Usage

If your `AWS S3` bucket is called `cometa` and inside it your image is called `superlight.jpg`, then you can request with:

[http://localhost:5050/noauth/cometa/superlight.jpg](http://localhost:5050/noauth/cometa/superlight.jpg)

This will only optimize the image and return it as `webp`, no resizing will happen.

#### Query parameters

- `w` or `width` *{integer}*: Width of the output image,
- `h` or `height` *{integer}*: Height of the output image, 
- `q` or `quality` *{integer}*: Quality of the output image (defaults to `80`, ignored with `png` format),
- `f` or `format` *{string}*: Format of the output image (defaults to `webp`).

Supported output formats are: `webp`, `png`, and `jpeg`.



## Authentication

Look at this URL:

```
http://cdn.ibrag.it/noauth/cometa/superlight.jpg?width=200&height=200
```

A malicious user could easily overload your service by making thousands of different size requests.

Consider the following snipped of pseudocode:

```
for (int reqWidth = 1; reqWidth < 100000; reqWidth++) {
	for (int reqHeight = 1; reqHeight < 100000; reqHeight++) {
    	GET http://cdn.ibrag.it/cometa/superlight.jpg?width={reqWidth}&height={reqHeight}
	}
}
```

That's almost 10 billion requests. Most certaily your service is dead by now.

In order to prevent this, **Cometa** offers an authentication option and we strongly recommend you use it. In order to authenticate a request you must compute a `SHA-1 hmac` signature and include it in your request URL.

#### Signature generation

Again, let's look at this URL:

```
http://cdn.ibrag.it/noauth/cometa/superlight.jpg?width=200&height=200
```

From this URL, in order to generate a valid signature, you will need:

- The hostname `cdn.ibrag.it`
- the query string `/cometa/superlight.jpg?width=200&height=200`

Your "signature" URL will be: `cdn.ibrag.it/cometa/superlight.jpg?width=200&height=200`

Generate a `SHA-1 hmac` from the above URL with your `COMETA_KEY`. This is your signature. Append this signature to your URL, between the hostname and the query string (instead of the `noauth` in the example URLs used above):

```
http://cdn.ibrag.it/{SIGNAURE-GOES-HERE}/cometa/superlight.jpg?width=200&height=200
```

**Note:** Using `noauth` in your URL stands for no request authentication whatsoever. (*Recommended only for local testing*)



## License

The MIT License (MIT)

Copyright (c) 2016 [iBrag.it](http://ibrag.it)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


<img src="http://ibrag.it/public/img/logo_286.png" width="30" style="padding-top:40px">
