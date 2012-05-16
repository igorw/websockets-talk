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

    var sock = new SockJS('http://localhost:8080/comments');
    sock.send('subscribe '+postId);
    sock.onmessage(function (event) {
        var parts, type, entity, data;

        // message format: type entity data
        // type: \w+
        // entity: \w+
        // data: JSON
        //
        // example: publish 2 "<div>...</div>"

        parts = event.data.match(/(\w+) (\w+) (.+)/);
        if (!parts) {
            throw "Invalid message provided: "+event.data;
        }

        type = parts[1];
        entity = parts[2];
        data = parts[3] ? JSON.parse(parts[3]) : null;

        switch (type) {
            case 'publish':
                renderComment(data);
                break;
        }
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
