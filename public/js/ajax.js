'use strict';

(function ($) {
    const bodyChat = document.getElementById("body-chat"),
        $bodyChat = $(bodyChat),  // body
        $text = $('#message'),  //textarea
        $submitMsg = $('#submitMsg');

    const _buildMessages = (data) => `
	<p>
		<span class="nickname">
			${data.nickname}: 
		</span>
		${data.message}
	</p>`;

    const _setScrolBottom = () => bodyChat.scrollTop = bodyChat.scrollHeight;

    $submitMsg.click(function () {
        let status = !!$text.val();
        $text.toggleClass('error', !status);
        if (!status) return;

        let data = {
            nickname: $text.data('nickname'),
            message: $text.val(),
            name: $text.data('name')
        };

        $text.val('');
        $.post('/messages', data);
    });

    let getData = function () {
        $bodyChat.html('');

        $.getJSON('/messages', function (msg) {
            for (var i in msg) {
                if (msg.hasOwnProperty(i)) {
                    $bodyChat.append(_buildMessages(msg[i]));
                }
            }
            _setScrolBottom();
        });
    };

    getData();
    setInterval(function () {
        getData();
    }, 1000);

})(jQuery);