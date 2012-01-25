var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket) {
    socket.on('mousedown', function (event) {
        event.source = socket.id;
        socket.broadcast.emit('mousedown', event);
    });

    socket.on('mousemove', function (event) {
        event.source = socket.id;
        socket.broadcast.emit('mousemove', event);
    });

    socket.on('mouseup', function (event) {
        event.source = socket.id;
        socket.broadcast.emit('mouseup', event);
    });
});
