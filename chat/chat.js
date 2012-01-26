(function () {
    "use strict";

    var socket = io.connect('http://localhost:8080'),
        messages = $('.messages'),
        form = $('form'),
        name;

    name = localStorage.getItem('chat.name') || window.prompt('Who are you?');
    localStorage.setItem('chat.name', name);

    socket.on('message', function (message) {
        var messageHtml = $('<div></div>').text(message.name + ': ' + message.body);
        messages.append(messageHtml);
        messages.prop('scrollTop', 100000);
    });

    form.submit(function (event) {
        event.preventDefault();

        var input = form.find('*[name=message]'),
            body = input.val();

        if (!body.length) {
            return;
        }

        socket.emit('message', { name: name, body: body });
        input.val('');
    });
})();
