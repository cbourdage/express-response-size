process.env.NO_DEPRECATION = 'express-response-size';

var after = require('after');
var assert = require('assert');
var http = require('http');
var request = require('supertest');
var responseSize = require('..');

describe('responseSize(fn)', function() {
  it('should call fn with response size', function(done) {
    var cb = after(2, done);
    var server = createServer(function(req, res, size) {
      assert.equal(req.url, '/');
      assert.equal(res.statusCode, 200);
      assert.ok(size >= 0);
      cb();
    });

    request(server)
      .get('/')
      .expect(200, cb);
  });

  it('should call fn from number option with response size', function(done) {
    var cb = after(2, done);
    var server = createServer(2, function(req, res) {
      assert.equal(req.url, '/');
      assert.equal(res.statusCode, 200);
      cb();
    });

    request(server)
      .get('/')
      .expect(200, cb);
  });
});

function createServer(opts, fn) {
  var _rs = responseSize(opts);
  return http.createServer(function(req, res) {
    _rs(req, res, function(err) {
      setTimeout(function () {
        fn && fn(req, res);
        res.statusCode = err ? (err.status || 500) : 200;
        res.end(err ? err.message : 'OK');
      }, 10);
    })
  });
}
