<img src="./app/public/cometa.png" width="350">

## Cometa
Super fast on demand and on the fly image resizing powered by [sharp](https://github.com/lovell/sharp)

```
Please note that this is work in progress, just ask if you need help with anything.
```


## Installation

- Clone this repository,
- copy `.env.example` to `.env` and fill in the values (see below),
- install: `npm install`,
- run: `grunt nodemon`

`Cometa` should now be running on the specified port.


#### Environment variables

Defined in your `.env` file or locally exported.

- `APP_CLUSTER`: Whether the application should make use of all available CPUs or not.
- `PORT`: Port on which your application will listen. `Defaults to 5050`.
- `COMETA_KEY`: A unique key used for request signature validation.
- `NOAUTH_ALLOWED`: Whether `noauth` requests are allowed or not.
- `REQUEST_TIMEOUT`: When using with an image URL, the time (in milliseconds) before timing out.

#### If you are using it with S3:
- `AWS_ACCESS_KEY`: Your AWS access key.
- `AWS_ACCESS_SECRET`: Your AWS access secret.
- `AWS_REGION`: Region of your S3 bucket.
- `AWS_BUCKET`: Name of your S3 bucket.


## Usage
#### With S3

If, for example, inside your `AWS_BUCKET` bucket, you have a folder called `cometa` and inside it you have an image called `superlight.jpg`, then your request will be:

```
HTTP 1.1
GET http://localhost:5050/noauth/cometa/superlight.jpg
```


#### With URLs

Use *Cometa* without S3. Just provide the `url` of the image you are requesting:

```
HTTP 1.1
GET http://localhost:5050/noauth/?url=http%3A%2F%2Fimages.google.com%2Fcars.jpg
```
*URL encoded* your `url`.


#### Query parameters

- `w` || `width`: (*integer*) Output width,
- `h` || `height`: (*integer*) Output height,
- `q` || `quality`: (*integer*) Output image quality. Defaults to `80`, ignored on `png` output,
- `f` || `filter`: (*string*) Apply a filter to the image: `sepia`, `grayscale`,
- `url`: (*string*) URL from which to fetch an image. Not needed when using with S3.


#### Input formats

Supported input formats are: `webp`, `png`, and `jpeg` (aka `jpg`).


#### Output formats

Supported output formats are: `webp`, `png`, and `jpeg`.

Simply append the required output format to the image URL:

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

Malicious users could easily overload your server by making thousands of different requests.<br />
Consider this:

```
for (int reqWidth = 1; reqWidth < 100000; reqWidth++) {
  for (int reqHeight = 1; reqHeight < 100000; reqHeight++) {
    GET http://localhost:5050/noauth/cometa/superlight.jpg?width={reqWidth}&height={reqHeight}
  }
}
```

That's almost 10 billion requests and your server is most certainly dead.

To prevent this, *Cometa* offers an authentication option -and we strongly recommend you use it. In order to authenticate a request you must compute a `SHA-1 hmac` signature and include it in the URL.


#### Signature generation

Let's look at this example URL:

```
HTTP 1.1
GET http://localhost:5050/[signature]/cometa/superlight.jpg?width=200&height=200
```

In order to generate a valid signature from this URL, you will need:

- The hostname: `localhost:5050`,
- The query string: `/cometa/superlight.jpg?width=200&height=200`,

Thus, your *signature URL* will be: `localhost:5050/cometa/superlight.jpg?width=200&height=200`<br />
Notice that `[signature]` is not part of the URL at this point.

- Generate a `SHA-1 hmac` of this URL using your key: `COMETA_KEY`,
- encode your signature to `hexadecimal`.

The signature must used in the URL. Place it between the `hostname` and the `query string` (instead of the `[signature]` in the example above). You signed URL will look something like this:

```
HTTP 1.1
GET http://localhost:5050/a9c619705e8fcaa770885cac1837ae950f5c8ba5/cometa/superlight.jpg?width=200&height=200
```

**Note:** Allowing `noauth` requests can be dangerous. *Use at your own discretion*


## License

[MIT](https://github.com/aichholzer/Cometa/blob/master/LICENSE)
Copyright (c) 2016 [Stefan Aichholzer](https://github.com/aichholzer)
