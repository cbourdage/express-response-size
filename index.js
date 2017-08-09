/*!
 * express-response-size
 * Copyright(c) 2017 Collin Bourdage
 * MIT Licensed
 */
/**
 * Middleware to expose the response size in a clean way
 * to interface with/check or do whatever you want with...
 *
 * @param {function|number} options
 * @return {function}
 * @public
 */
function responseSize(options) {
  const fn = typeof options !== 'function'
    ? callbackFn(options)
    : options;

  return function(req, res, next) {
    res.on('finish', function() {
      fn(req, res, res._contentLength, options);  // eslint-disable-line no-underscore-dangle
    });

    next();
  };
}

/**
 * Callback function to handle our size argument
 *
 * @param {number|string} options
 * @return {Function}
 */
function callbackFn(options) {
  const threshold = typeof options !== 'number'
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

module.exports = responseSize;
