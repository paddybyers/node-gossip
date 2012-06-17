var test    = require("tap").test;
var Gossiper = require('../../').Gossiper;

test('basic test', {skip: true}, function (t) {
  t.plan(4);

  var seed = new Gossiper(7000, [], '127.0.0.1');
  seed.start();

  var g1 = new Gossiper(7001, ['127.0.0.1:7000'], '127.0.0.1');
  g1.start();
  g1.setLocalState('holla','at');

  var g2 = new Gossiper(7002, ['127.0.0.1:7000'], '127.0.0.1');
  g2.start();
  g2.setLocalState('your','node');

  setTimeout(function () {
    seed.stop();
    g1.stop();
    g2.stop();

    t.equal('node', g1.peerValue('127.0.0.1:7002', 'your'));
    t.equal('node', g2.peerValue('127.0.0.1:7002', 'your'));
    t.equal('node', seed.peerValue('127.0.0.1:7002', 'your'));
    t.equal('at', g2.peerValue('127.0.0.1:7001', 'holla'));
    t.end();
  }, 10000);
})
