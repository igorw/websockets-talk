var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket) {
    var color = '#'+Math.floor(Math.random()*16777215).toString(16);

    socket.emit('color', color);

    socket.on('mousedown', function (event) {
        event.source = socket.id;
        event.color = color;
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
