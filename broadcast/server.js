var broadcast = require('./lib/broadcast')(),
    connect = require('connect'),
    zmq = require('zmq');

var server = connect()
    .use(connect.static(__dirname + '/public'))
    .listen(8080);

broadcast.installHandlers(server, {
    prefix: '/broadcast',
    sockjs_url: '/sockjs-0.3.js'
});

var sub = zmq.socket('sub');
sub.subscribe('');
sub.bind('tcp://*:5555');

sub.on('message', function (message) {
    broadcast.send(message);
});
