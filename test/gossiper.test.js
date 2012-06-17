var test      = require("tap").test;
var Gossiper  = require('../lib/gossiper').Gossiper;
var PeerState = require('../lib/peer_state').PeerState;

test('should be able to set and retrieve local state', function (t) {
  var g = new Gossiper();
  g.setLocalState('hi', 'hello');
  t.equal('hello', g.getLocalState('hi'));
  t.end();
})

test('should be able to get a list of keys for a peer', function (t) {
  var g = new Gossiper();
  g.peers['p1'] = new PeerState();
  g.peers['p1'].attrs['keyz'] = [];
  g.peers['p1'].attrs['keyzy'] = [];
  t.deepEqual(['keyz','keyzy'], g.peerKeys('p1'));
  t.end();
})

test('should be able to get the value of a key for a peer', function (t) {
  var g = new Gossiper();
  g.peers['p1'] = new PeerState();
  g.peers['p1'].attrs['keyz'] = ['hi', 1];
  t.equal('hi', g.peerValue('p1','keyz'));
  t.end();
})

test('should be able to get a list of peers', function (t) {
  var g = new Gossiper();
  g.peers['p1'] = new PeerState();
  g.peers['p2'] = new PeerState();
  t.deepEqual(['p1','p2'], g.allPeers());
  t.end();
})

test('should emit new_peer event when we learn about a new peer', function (t) {
  t.plan(1);

  var g = new Gossiper();
  // mock scuttle
  g.scuttle = { 'scuttle' : function (v) {
    return { 'new_peers' : ['127.0.0.1:8010'] };
  }}
  g.on('new_peer', function () {
    t.ok(true);
  })
  g.firstResponseMessage({});
})

test('should emit update event when we learn more about a peer', function (t) {
  t.plan(1);

  var g = new Gossiper();
  g.peers['127.0.0.1:8010'] = new PeerState();
  g.handleNewPeers(['127.0.0.1:8010']);
  g.on('update', function (peer,k,v) {
    t.deepEqual(['127.0.0.1:8010', 'howdy', 'yall'], [peer,k,v]);
  })
  g.peers['127.0.0.1:8010'].updateLocal('howdy', 'yall');
})