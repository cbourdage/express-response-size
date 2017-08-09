# express-response-size
The middleware module records the response size/content length for requests in HTTP servers. This was both built as a way to become more familiar with express middleware as well as impose some tracking/accountability on a project around page size during development to optimize for our application.

## Installation
```sh
$ npm install express-response-size
```

## API

<!-- eslint-disable no-unused-vars -->

```js
var responseSize = require('express-response-size');
```

### responseSize(options)

##### number

A threshold number to log a "warning" to the console on the server.

#### function

A callback function that will be invoked with the following arguments: `fn(req, res, size)`

#### Examples

**Note** all examples are presented as being used with express but should work for a standard node server since it works with the `ServerResponse` object and no specific express enhancements/apis.

The default for the middleware will just log to the console with the content length (in bytes) for each http response served.
```js
var responseSize = require('express-response-size');
app.use(responseSize());
```

Providing a number to the middleware will log and compare the content length (in bytes) to a threshold and log a warning note.
```js
app.use(responseSize(300));
```

Providing a function to the middleware will allow you to track the content length (in bytes) as you please.
```js
app.use(responseSize((req, res, size) => {
  const stat = `${req.method} - ${req.url.replace(/[:.]/g, '')}`;
  const convertedSize = Math.round(size / 1024);
  const outputSize = `${convertedSize}kb`;
  fs.appendFile(path.join(__dirname, '..', 'logs', 'benchmark-size.csv'), `${stat},${outputSize}\n`);
  // IE: shove into a database for further analysis, wait, spreadsheets are databases, right?
}));
```
