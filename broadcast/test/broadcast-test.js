var buster = require('buster'),
    sinon = require('sinon'),
    events = require('events'),
    _broadcast = require('../lib/broadcast');

buster.testCase('broadcast sockjs server', {
    'setUp': function () {
        this.broadcast = _broadcast();
    },
    'should accept one connection': function () {
        var conn = new events.EventEmitter();

        this.broadcast.emit('connection', conn);
        assert.equals(this.broadcast.clients, [conn]);
    },
    'should accept many connections': function () {
        var conns = [
            new events.EventEmitter(),
            new events.EventEmitter(),
            new events.EventEmitter()
        ];

        conns.forEach(function (conn) {
            this.broadcast.emit('connection', conn);
        }, this);
        assert.equals(this.broadcast.clients, conns);
    },
    'tearDown': function () {
    },
});
