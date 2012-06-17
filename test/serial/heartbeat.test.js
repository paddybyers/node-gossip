var test     = require('tap').test;
var Gossiper = require('../../lib/gossiper').Gossiper;


test('heartbeat', {skip: true}, function (t) {
  t.plan(2);

  var seed = new Gossiper(7000, [], '127.0.0.1');
  seed.start();

  var g1 = new Gossiper(7001, ['127.0.0.1:7000'], '127.0.0.1');
  g1.start();

  var g2 = new Gossiper(7002, ['127.0.0.1:7000'], '127.0.0.1');
  g2.start();

  g2.on('peer_failed', function (peer) {
    t.equal('127.0.0.1:7001', peer);
  })

  g2.on('peer_alive', function (peer) {
    t.equal('127.0.0.1:7001', peer);
  })

  setTimeout(function () {
    console.log("stopping g1");
    g1.stop();
  }, 10000);

  setTimeout(function () {
    console.log("starting g1");
    g1.start();
  }, 45000);

  setTimeout(function () {
    g1.stop();
    seed.stop();
    g2.stop();
  }, 55000);
})