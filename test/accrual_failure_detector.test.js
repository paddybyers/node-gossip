var test = require("tap").test
var AccrualFailureDetector = require('../lib/accrual_failure_detector').AccrualFailureDetector;

test('should have a low phi value after only a second', function (t) {
  var afd = new AccrualFailureDetector();
  var time = 0;
  for (var i = 0;i < 100;i++) {
    time += 1000;
    afd.add(time);
  }
  t.ok(afd.phi(time + 1000) < 0.5);
  t.end();
})

test('should have a high phi value after ten seconds', function (t) {
  var afd = new AccrualFailureDetector();
  var time = 0;
  for (var i = 0;i < 100;i++) {
    time += 1000;
    afd.add(time);
  }
  t.ok(afd.phi(time + 10000) > 4);
  t.end();
})

test('should only keep last 1001 values', function (t) {
  var afd = new AccrualFailureDetector();
  var time = 0;
  for (var i = 0;i < 2000;i++) {
    time += 1000;
    afd.add(time);
  }
  t.equal(afd.intervals.length, 1001);
  t.end();
})