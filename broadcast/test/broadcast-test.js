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
    'should send messages to all connections': function () {
        var createConnectionMock = function () {
            var conn = new events.EventEmitter();
            conn.write = sinon.spy();
            return conn;
        };

        var conns = [
            createConnectionMock(),
            createConnectionMock(),
            createConnectionMock()
        ];

        conns.forEach(function (conn) {
            this.broadcast.emit('connection', conn);
        }, this);

        this.broadcast.send('foobar');

        conns.forEach(function (conn) {
            assert.calledWith(conn.write, 'foobar');
        });
    },
    'should remove connections on disconnect': function () {
        var conns = [
            new events.EventEmitter(),
            new events.EventEmitter()
        ];

        conns.forEach(function (conn) {
            this.broadcast.emit('connection', conn);
        }, this);

        conns[0].emit('close');

        assert.equals(this.broadcast.clients, [conns[1]]);
    }
});
