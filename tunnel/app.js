// stolen from creationix
// telnet localhost 5000
// echo 'FUUUU' | nc localhost 5000

var net = require('net'),
    connect = require('connect'),
    sio = require('socket.io');

var server = connect()
    .use(connect.static(__dirname + '/public'))
    .listen(8080);

var io = sio.listen(server);

var clients = [];

net.createServer(function (socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort

    clients.push(socket);

    socket.write("Welcome " + socket.name + "\n");
    broadcast(socket.name + " joined the chat\n");

    socket.on('data', function (data) {
        broadcast(socket.name + "> " + data);
    });

    socket.on('end', function () {
        clients.splice(clients.indexOf(socket), 1);
        broadcast(socket.name + " left the chat.\n");
    });

    function broadcast(message) {
        io.sockets.emit('message', message);
        process.stdout.write(message);
    }

}).listen(5000);

console.log("Tunnel server running at port 5000");
