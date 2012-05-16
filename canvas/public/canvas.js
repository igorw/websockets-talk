var Paintbrush,
    convertEvent,
    socket = io.connect(),
    canvas = $('#le_canvas')[0];

Paintbrush = function (canvas) {
    this.context = canvas.getContext('2d');
};

Paintbrush.prototype = {
    started: false,
    strokeStyle: '#000000',
    context: null,
    socket: null,
    draw: function (offsetX, offsetY) {
        this.context.lineTo(offsetX, offsetY);
        this.context.stroke();
    },
    mousedown: function (event) {
        event = convertEvent(event);

        this.context.strokeStyle = this.strokeStyle;
        this.context.beginPath();
        this.context.moveTo(event.offsetX, event.offsetY);
        this.started = true;

        this.socket && this.socket.emit('mousedown', event);
    },
    mousemove: function (event) {
        event = convertEvent(event);

        if (this.started) {
            this.draw(event.offsetX, event.offsetY);

            this.socket && this.socket.emit('mousemove', event);
        }
    },
    mouseup: function (event) {
        event = convertEvent(event);

        if (this.started) {
            this.draw(event.offsetX, event.offsetY);
            this.started = false;

            this.socket && this.socket.emit('mouseup', event);
        }
    },
    bind: function (canvas) {
        var that = this;

        $(canvas).on('mousedown', function (event) {
            that.mousedown(event);
        });
        $(canvas).on('mousemove', function (event) {
            that.mousemove(event);
        });
        $(canvas).on('mouseup', function (event) {
            that.mouseup(event);
        });
    },
    bindSocket: function (socket) {
        this.socket = socket;
    }
};

convertEvent = function (event) {
    return {
        offsetX: event.offsetX || (event.pageX - $(event.target).position().left),
        offsetY: event.offsetY || (event.pageY - $(event.target).position().top)
    };
};

(function () {
    var brush;

    socket.on('color', function (color) {
        brush = new Paintbrush(canvas);
        brush.strokeStyle = color;
        brush.bind(canvas);
        brush.bindSocket(socket);
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
        brush.strokeStyle = event.color;
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
