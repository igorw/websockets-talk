var Paintbrush,
    convertEvent,
    socket = io.connect('http://localhost:81'),
    canvas = $('#le_canvas')[0];

Paintbrush = function (canvas) {
    var that = this;

    this.context = canvas.getContext('2d');

    canvas.addEventListener('mousedown', function (event) {
        that.mousedown(event);
    });
    canvas.addEventListener('mousemove', function (event) {
        that.mousemove(event);
    });
    canvas.addEventListener('mouseup', function (event) {
        that.mouseup(event);
    });
};

Paintbrush.prototype = {
    started: false,
    context: null,
    draw: function (offsetX, offsetY) {
        this.context.lineTo(offsetX, offsetY);
        this.context.stroke();
    },
    mousedown: function (event) {
        this.context.beginPath();
        this.context.moveTo(event.offsetX, event.offsetY);
        this.started = true;
    },
    mousemove: function (event) {
        if (this.started) {
            this.draw(event.offsetX, event.offsetY);
        }
    },
    mouseup: function (event) {
        if (this.started) {
            this.draw(event.offsetX, event.offsetY);
            this.started = false;
        }
    }
};

convertEvent = function (event) {
    return {offsetX: event.offsetX, offsetY: event.offsetY};
};

(function () {
    var brush;

    brush = new Paintbrush(canvas);

    // send all events through ws
    canvas.addEventListener('mousedown', function (event) {
        socket.emit('mousedown', convertEvent(event));
    });
    canvas.addEventListener('mousemove', function (event) {
        socket.emit('mousemove', convertEvent(event));
    });
    canvas.addEventListener('mouseup', function (event) {
        socket.emit('mouseup', convertEvent(event));
    });
})();

(function () {
    var brushes, getBrush;

    brushes = {};

    getBrush = function (event) {
        brushes[event.source] = brushes[event.source] || new Paintbrush(canvas);

        return brushes[event.source];
    };

    socket.on('mousedown', function (event) {
        var brush = getBrush(event);
        brush.mousedown(event);
    });
    socket.on('mousemove', function (event) {
        var brush = getBrush(event);
        brush.mousemove(event);
    });
    socket.on('mouseup', function (event) {
        var brush = getBrush(event);
        brush.mouseup(event);
    });
})();
