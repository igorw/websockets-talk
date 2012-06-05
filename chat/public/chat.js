(function () {
    "use strict";

    var sock = new SockJS('http://localhost:8080/broadcast'),
        messages = $('.messages'),
        form = $('form'),
        name;

    name = localStorage.getItem('chat.name') || window.prompt('Who are you?');
    localStorage.setItem('chat.name', name);

    sock.onmessage = function (event) {
        var message = JSON.parse(event.data),
            messageHtml;

        messageHtml = $('<div></div>').text(message.name + ': ' + message.body);
        messages.append(messageHtml);
        messages.prop('scrollTop', 100000);
    };

    form.submit(function (event) {
        event.preventDefault();

        var input = form.find('*[name=message]'),
            body = input.val(),
            message;

        if (!body.length) {
            return;
        }

        message = { name: name, body: body };
        sock.send(JSON.stringify(message));
        input.val('');
    });
})();
