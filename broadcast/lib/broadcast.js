var sockjs = require('sockjs');

module.exports = function () {
    var broadcast = sockjs.createServer();

    broadcast.on('connection', function (conn) {
        broadcast.clients.push(conn);

        conn.on('close', function () {
            var index = broadcast.clients.indexOf(conn);
            if (-1 === index) {
                broadcast.clients.splice(index, 1);
            }
        });
    });

    broadcast.clients = [];
    broadcast.send = function (message) {
        this.clients.forEach(function (conn) {
            conn.write(message);
        });
    };

    return broadcast;
};
