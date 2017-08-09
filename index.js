/*!
 * express-response-size
 * Copyright(c) 2017 Collin Bourdage
 * MIT Licensed
 */
module.exports = responseSize;

/**
 * Middleware to expose the response size in a clean way
 * to interface with/check or do whatever you want with...
 *
 * @param {function} [options]
 * @return {function}
 * @public
 */
function responseSize(options) {
  var fn = typeof options !== 'function'
    ? callbackFn(options)
    : options;

  return function responseSize(req, res, next) {
    res.on('finish', function() {
      fn(req, res, res._contentLength, options);
    });

    next();
  };
}

function callbackFn(options) {
  var threshold = typeof options !== 'number'
    ? Number(options)
    : options;

  return function(req, res, size) {
    if (threshold > 0 && size > threshold) {
      console.log('File size threshold (%s) warning: %s', threshold, size);
    } else {
      console.log('File size: %s', size);
    }
  };
}
