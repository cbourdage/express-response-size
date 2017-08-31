/*!
 * express-response-size
 * Copyright(c) 2017 Collin Bourdage
 * MIT Licensed
 */
const onHeaders = require('on-headers');

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
    onHeaders(res, function() {
      // if we have the expressjs/compression middleware installed, _contentLength
      // does not get set so we need to check our headers
      fn(req, res, res.getHeader('Content-Length') || res._contentLength);  // eslint-disable-line no-underscore-dangle
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
