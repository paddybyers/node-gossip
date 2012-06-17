var test      = require("tap").test;
var PeerState = require('../lib/peer_state').PeerState;

test('updateWithDelta should set key to value', function (t) {
  var ps = new PeerState();
  ps.updateWithDelta('a', 'hello', 12);
  t.equal('hello', ps.getValue('a'));
  t.end();
})

test('updateWithDelta should update the max version', function (t) {
  var ps = new PeerState();
  ps.updateWithDelta('a', 'hello', 12);
  ps.updateWithDelta('a', 'hello', 14);
  t.equal(14, ps.max_version_seen);
  t.end();
})

test('updates should trigger \'update\' event', function (t) {
  t.plan(2);
  var ps = new PeerState();
  var n = 0;
  ps.on('update', function (k,v) {
    ++n;
    t.equal('a', k);
    t.equal('hello', v);
  });
  ps.updateWithDelta('a', 'hello', 12);
})

test('updateLocal should set key to value', function (t) {
  var ps = new PeerState();
  ps.updateLocal('a', 'hello', 12);
  t.equal('hello', ps.getValue('a'));
  t.end();
})

test('updateLocal should increment the max version', function (t) {
  var ps = new PeerState();
  ps.updateLocal('a', 'hello');
  ps.updateLocal('a', 'hello');
  t.equal(2, ps.max_version_seen);
  t.end();
})

test('deltasAfterVersion should return all deltas after a version number', function (t) {
  var ps = new PeerState();
  ps.updateLocal('a', 1);
  ps.updateLocal('b', 'blah');
  ps.updateLocal('a', 'super');
  t.deepEqual([['a','super','3']], ps.deltasAfterVersion(2));
  t.end();
})