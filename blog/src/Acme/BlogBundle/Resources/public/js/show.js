(function () {
    "use strict";

    var updateDates = function () {
        $('*[data-date]').each(function () {
            var el = $(this),
                date = el.attr('data-date'),
                fromNowDate = moment(date).fromNow();

            el.text(fromNowDate);
        });
    };

    var renderComment = function (renderedRow) {
        var commentHtml = $(renderedRow);

        commentHtml.hide();
        $('.comments').append(commentHtml);
        updateDates();
        commentHtml.slideDown();
    };

    var resetForm = function (form) {
        form.find(':input')
            .not(':button, :submit, :reset, :hidden')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
    };

    $('.comment-form form').submit(function (event) {
        event.preventDefault();

        var form = $(this),
            action = form.attr('action'),
            data = form.serialize();

        $.post(action, data, function () {
            resetForm(form);
        });
    });

    var postId = $('*[data-post-id]').attr('data-post-id');

    var socket = io.connect('http://localhost:8080');
    socket.on('post.'+postId+'.comment.create', function (data) {
        renderComment(data);
    });

    updateDates();

    setTimeout(function updateDatesTimeout() {
        updateDates();
        setTimeout(updateDatesTimeout, 10000);
    }, 10000);

    var formOffsetTop = $('.comment-form').position().top - 20;
    $(window).scroll(function (event) {
        var scrollTop = $(window).scrollTop();

        if (scrollTop > formOffsetTop) {
            $('.comment-form').css({
                position: 'fixed',
                left: $('.comment-form').position().left,
                top: 20
            });
        } else {
            $('.comment-form').css('position', 'static');
        }
    });
})();
