var socket = io.connect('http://localhost:81'),
    canvas = $('#le_canvas');

(function () {
    var context = canvas[0].getContext('2d'),
        started = false,
        draw;

    draw = function (offsetX, offsetY) {
        context.lineTo(offsetX, offsetY);
        context.stroke();
    };

    canvas.mousedown(function (event) {
        context.beginPath();
        context.moveTo(event.offsetX, event.offsetY);
        started = true;
    });

    canvas.mousemove(function (event) {
        if (started) {
            draw(event.offsetX, event.offsetY);
        }
    });

    canvas.mouseup(function (event) {
        if (started) {
            draw(event.offsetX, event.offsetY);
            started = false;
        }
    });
})();

// WIP
socket.on('draw', function (data) {
    var context = canvas[0].getContext('2d');

    context.beginPath();
    context.moveTo(data.offsetX, data.offsetY);
    context.lineTo(data.offsetX, data.offsetY);
    context.stroke();
});
