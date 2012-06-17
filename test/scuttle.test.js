var test      = require("tap").test;
var Scuttle   = require('../lib/scuttle').Scuttle;
var PeerState = require('../lib/peer_state').PeerState;

test('digest should have max versions we have seen', function (t) {
  var p1 = new PeerState();
  p1.max_version_seen = 10;
  var p2 = new PeerState();
  p2.max_version_seen = 12;
  var p3 = new PeerState();
  p3.max_version_seen = 22;

  var peers = { 'a' : p1, 'b' : p2,'c' : p3 }

  var scuttle = new Scuttle(peers);
  t.deepEqual( { 'a' : 10, 'b' : 12, 'c' : 22 }, scuttle.digest());
  t.end();
})

test('new peers should be in result', function (t) {
  var scuttle = new Scuttle({});
  var res = scuttle.scuttle( { 'new_peer' : 12 } ) 
  t.deepEqual(['new_peer'], res.new_peers); 
  t.end();
})

test('request all information about a new peer', function (t) {
  var scuttle = new Scuttle({});
  var res = scuttle.scuttle( { 'new_peer' : 12 } ) 
  t.deepEqual({ 'new_peer' : 0}, res.requests);
  t.end();
})

test('send peer all deltas for peers we know more about', function (t) {
  var p1 = new PeerState();
  p1.updateLocal('hi', 'hello');
  p1.updateLocal('meh', 'goodbye');
  var scuttle = new Scuttle({'me' : p1});
  var res = scuttle.scuttle( {'me' : 0, 'new_peer' : 12 } ) 
  t.deepEqual([['me', 'hi', 'hello', 1], ['me', 'meh', 'goodbye', 2]], 
              res.deltas); 
  t.end();
})

// deltas should be sorted by version number
// deltas should be ordered by the peer with the most