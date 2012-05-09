var sockjs = require('sockjs'),
    connect = require('connect'),
    zmq = require('zmq'),
    server,
    clients = [],
    broadcast,
    sub;

server = connect()
    .use(connect.static(__dirname + '/public'))
    .listen(8080);

broadcast = sockjs.createServer();
broadcast.on('connection', function (conn) {
    clients.push(conn);

    conn.on('close', function () {
        var index = clients.indexOf(conn);
        if (-1 === index) {
            clients.splice(index, 1);
        }
    });
});
broadcast.installHandlers(server, {
    prefix: '/broadcast',
    sockjs_url: 'http://localhost:8080/sockjs-0.3.js'
});

sub = zmq.socket('sub');
sub.subscribe('');
sub.bind('tcp://*:5555');

sub.on('message', function (message) {
    clients.forEach(function (conn) {
        conn.write(message);
    });
});
