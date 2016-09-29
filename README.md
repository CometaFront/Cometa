<img src="./app/public/cometa.png" width="350">

## Cometa
Super fast on demand and on the fly image resizing powered by [sharp](https://github.com/lovell/sharp)

```
Please note that this is work in progress, just ask if you need help with anything.
```


## Installation

- Copy the `.env.example` to `.env` and fill in the required values,
- clone this repository and navigate to its location,
- install what is needed: `npm install`,
- run the application, with grunt: `grunt nodemon`

Your application should now be running on the port you specified in your `.env` file.<br />
Currently it's only possible to fetch images from `AWS S3` buckets.


#### Environment variables

Defined in your `.env` variable or locally exported.

- `APP_CLUSTER`: Whether the application should make use of all available CPUs or not.
- `PORT`: Port on which your application will listen. `Defaults to 5050`.
- `COMETA_KEY`: A unique key used for request signature validation.
- `NOAUTH_ALLOWED`: Whether `noauth` requests are allowed or not.
- `REQUEST_TIMEOUT`: When using with an image URL, the time (in milliseconds) before timing out.

#### If you are fetching images from S3:
- `AWS_ACCESS_KEY`: Your AWS access key.
- `AWS_ACCESS_SECRET`: Your AWS access secret.
- `AWS_REGION`: Region of your S3 bucket.
- `AWS_BUCKET`: Name of your S3 bucket.



## Usage

#### With AWS S3

If, for example, inside your `AWS_BUCKET` bucket, you have a folder called `cometa` and inside it an image called `superlight.jpg`, then request it like this:

```
HTTP 1.1
GET http://localhost:5050/noauth/cometa/superlight.jpg
```


#### With an URL

It's also possible to use *Cometa* without an AWS S3 bucket. Just provide the `url` of the image being requested:

```
HTTP 1.1
GET http://localhost:5050/noauth/?url=http%3A%2F%2Fimages.google.com%2Fcars.jpg
```

The `url` should be properly *URL encoded*.


#### Query parameters

- `w` or `width` *{integer}*: Output width,
- `h` or `height` *{integer}*: Output height,
- `q` or `quality` *{integer}*: Output image quality (defaults to `80`, ignored with `png`)
- `f` or `filter` *{string}*: Filter to apply to the image (sepia, grayscale, etc.)
- `url` *{string}*: The URL from which to request the image. (Not needed when using with AWS)


#### Input formats

Supported input formats are: `webp`, `png`, and `jpeg` (same as `jpg`).


#### Output formats

Supported output formats are: `webp`, `png`, and `jpeg`.

Simply append the required format to the image URL:

```
HTTP 1.1
GET http://localhost:5050/noauth/cometa/superlight.jpg.webp
// Outputs webp

HTTP 1.1
GET http://localhost:5050/noauth/cometa/superlight.jpg.png
// Outputs png
```



## Authentication

Look at this URL:

```
HTTP 1.1
GET http://localhost:5050/noauth/cometa/superlight.jpg?width=200&height=200
```

A malicious user could easily overload your service by making thousands of different size requests.

Consider the following snipped of pseudocode:

```
for (int reqWidth = 1; reqWidth < 100000; reqWidth++) {
  for (int reqHeight = 1; reqHeight < 100000; reqHeight++) {
    GET http://localhost:5050/noauth/cometa/superlight.jpg?width={reqWidth}&height={reqHeight}
  }
}
```

That's almost 10 billion requests, most certainly your service is dead by now.

To prevent this, *Cometa* offers an authentication option -and we strongly recommend you use it. In order to authenticate a request you must compute a `SHA-1 hmac` signature and include it in your URL.


#### Signature generation

Again, let's look at the following URL:

```
HTTP 1.1
GET http://localhost:5050/[signature]/cometa/superlight.jpg?width=200&height=200
```

In order to generate a valid signature from this example URL, you will need:

- The hostname: `localhost:5050`,
- The query string: `/cometa/superlight.jpg?width=200&height=200`

Thus, your *signature URL* will be: `localhost:5050/cometa/superlight.jpg?width=200&height=200`

- Generate a `SHA-1 hmac` of this URL using your key: `COMETA_KEY`,
- encode your signature to `hexadecimal`.

The signature must be made part of the URL. Place it between the hostname and the query string (instead of the `[signature]` in the example above). You signed URL will look something like this:

```
HTTP 1.1
GET http://localhost:5050/a9c619705e8fcaa770885cac1837ae950f5c8ba5/cometa/superlight.jpg?width=200&height=200
```

**Note:** Allowing `noauth` requests can be dangerous. *Use at your own discretion*


## License

[MIT](https://github.com/aichholzer/Cometa/blob/master/LICENSE)
Copyright (c) 2016 [Stefan Aichholzer](https://github.com/aichholzer)
