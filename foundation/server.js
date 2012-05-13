var sockjs = require('sockjs'),
    connect = require('connect'),
    zmq = require('zmq'),
    clients = [];

var server = connect()
    .use(connect.static(__dirname + '/public'))
    .listen(8080);

var broadcast = sockjs.createServer({
    prefix: '/broadcast',
    sockjs_url: '/sockjs-0.3.js'
});
broadcast.on('connection', function (conn) {
    clients.push(conn);

    conn.on('close', function () {
        var index = clients.indexOf(conn);
        if (-1 === index) {
            clients.splice(index, 1);
        }
    });
});
broadcast.installHandlers(server);

var sub = zmq.socket('sub');
sub.subscribe('');
sub.bind('tcp://*:5555');

sub.on('message', function (message) {
    clients.forEach(function (conn) {
        conn.write(message);
    });
});
