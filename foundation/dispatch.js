var io = require('socket.io').listen(81),
    zmq = require('zmq'),
    sock = zmq.socket('sub');

sock.subscribe('');
sock.bind('tcp://*:5555');

sock.on('message', function (msg) {
    var event = JSON.parse(msg);
    io.sockets.emit(event.type, event.data);
});
