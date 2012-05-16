var socket = io.connect();

var escapeHtml = function (input) {
    return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

socket.on('message', function (message) {
    document.getElementById('messages').innerHTML += '<div>'+escapeHtml(message)+'</div>';
});
