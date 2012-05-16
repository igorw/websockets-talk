var events = require('events'),
    sockjs = require('sockjs'),
    http = require('http'),
    zmq = require('zmq');

var channel = new events.EventEmitter();

var server = http.createServer();
server.listen(8080);

var pubsub = require('./lib/pubsub');
pubsub.server.installHandlers(server, { prefix: '/comments' });

var sub = zmq.socket('sub');
sub.subscribe('');
sub.bind('tcp://*:5555');

// zmq message format (JSON): { "type": "publish", "entity": "2", "data": "<div>...</div>" }

sub.on('message', function (message) {
    console.log('from zeromq: '+message);
    var parsed;
    try {
        parsed = JSON.parse(message);
        if ('publish' === message.type) {
            pubsub.channel.emit(message.entity, message.data);
        }
        console.log('listeners: '+pubsub.channel.listeners(message.entity).length);
    } catch (e) {
        console.log(e);
    }
});
