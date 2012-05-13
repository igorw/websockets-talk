var sock = new SockJS('http://localhost:8080/broadcast');
sock.onmessage = function (event) {
    var parts, type, data;

    // message format: type [data]
    // type: \w+
    // data: JSON
    //
    // example: debug "foobar"

    parts = event.data.match(/(\w+)( (.+)|$)/);
    if (!parts) {
        throw "Invalid message provided: "+event.data;
    }

    type = parts[1];
    data = parts[3] ? JSON.parse(parts[3]) : null;

    switch (type) {
        case 'debug':
            console.log(data);
            break;
    }
};
