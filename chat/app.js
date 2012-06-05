var broadcast = require('../broadcast/lib/broadcast')(),
    connect = require('connect'),
    bufferLimit = 15,
    messages;

messages = [];

var server = connect()
    .use(connect.static(__dirname + '/public'))
    .listen(8080);

broadcast.installHandlers(server, {
    prefix: '/chat',
    sockjs_url: '/sockjs-0.3.js'
});

broadcast.on('connection', function (conn) {
    messages.forEach(function (message) {
        conn.write(message);
    });

    conn.on('data', function (message) {
        broadcast.send(message);
        messages.push(message);

        if (messages.length > bufferLimit) {
            messages = messages.splice(-bufferLimit, bufferLimit);
        }
    });
});
