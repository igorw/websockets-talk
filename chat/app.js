var io = require('socket.io').listen(8080),
    bufferLimit = 15,
    messages;

messages = [];

io.sockets.on('connection', function (socket) {

    messages.forEach(function (message) {
        socket.emit('message', message);
    });

    socket.on('message', function (message) {
        io.sockets.emit('message', message);
        messages.push(message);

        if (messages.length > bufferLimit) {
            messages = messages.splice(-bufferLimit, bufferLimit);
        }
    });

});
