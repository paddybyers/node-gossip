var buffer  = require('buffer'),
    events  = require('events'),
    util    = require('util'),
    assert  = require('assert'),
    carrier = require('carrier');


var Stream = function(s) {
    var self = this;

    events.EventEmitter.call(self);

    // Send a message down the stream
    self.send = function(obj) {
        assert(obj instanceof Object);

        var data = JSON.stringify(obj);
        data += '\r\n';

        // Allows the caller to pass additional arguments, which are passed
        // faithfully down to the write() method of the underlying stream.
        var args = [data];
        for (i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        return s.write.apply(s, args);
    };

    // parse messages coming off of the stream
    carrier.carry(s, function (line) {
        var msg = JSON.parse(line);
        self.emit('msg', msg);
    })
}

util.inherits(Stream, events.EventEmitter);
exports.Stream = Stream;