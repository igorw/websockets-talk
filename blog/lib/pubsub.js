var events = require('events'),
    sockjs = require('sockjs');

var channel = new events.EventEmitter();

var subscribeToEntity = function (conn, entity) {
    console.log('subscribing to: '+entity);
    var listener = function (data) {
        console.log('publishing: '+message);
        conn.write('publish '+entity+' '+data);
    };
    channel.on(entity, listener);
    conn.on('close', function () {
        channel.removeListener(entity, listener);
    });
};

var handleMessage = function (conn, message) {
    console.log('from client: '+message);
    var parts, type, entity;

    // message format: type entity
    // type: \w+
    // entity: \w+
    //
    // example: subscribe 2

    parts = message.match(/(\w+) (\w+)/);
    if (!parts) {
        console.log("Invalid message provided: "+message);
        return;
    }

    type = parts[1];
    entity = parts[2];

    switch (type) {
        case 'subscribe':
            subscribeToEntity(conn, entity);
            break;
    }
};

var server = sockjs.createServer();
server.on('connection', function (conn) {
    conn.on('data', function (message) {
        handleMessage(conn, message);
    });
});

module.exports.channel = channel;
module.exports.server = server;
