$('form.new_comment').submit(function (event) {
    event.preventDefault();
    event.stopPropagation();

    var form = $(this),
        action = form.attr('action'),
        data = form.serialize();

    $.post(action, data, function () {
        var alertMessage = '<div class="alert-message success"><p><strong>Cheers</strong> for the comment!</p></div>';
        form.replaceWith(alertMessage);
    });
});

var socket = io.connect('http://localhost:8080');
socket.on('comment.create', function (data) {
    var comment = $('<p></p>').text(data.body);
    comment.hide();

    $('.comments').append(comment);

    comment.slideDown();
});
