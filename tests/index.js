const after = require('after');
const assert = require('assert');
const http = require('http');
const request = require('supertest');
const responseSize = require('..');

describe('responseSize(fn)', function() {
  it('should call fn with response size', function(done) {
    const cb = after(2, done);
    const server = createServer(function(req, res, size) {
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
    const cb = after(2, done);
    const server = createServer(2, function(req, res) {
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
  const rSize = responseSize(opts);
  return http.createServer(function(req, res) {
    rSize(req, res, function(err) {
      setTimeout(function() {
        fn && fn(req, res);
        res.statusCode = err ? (err.status || 500) : 200; // eslint-disable-line no-param-reassign
        res.end(err ? err.message : 'OK');
      }, 10);
    });
  });
}
