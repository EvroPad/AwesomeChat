'use strict';

(function ($) {
    const bodyChat = document.getElementById("body-chat"),
        $bodyChat = $(bodyChat),
        $text = $('#message'),
        $submitMsg = $('#submitMsg');

    const _buildMessages = (data) => `
	<p>
		<span class="nickname" style="color:${data.color};">
			${data.nickname}: 
		</span>
		${data.message}
	</p>`;

    const _setScrolBottom = () => bodyChat.scrollTop = bodyChat.scrollHeight;
    const id = sessionStorage.getItem('__chat') || '0';

    let socket = io.connect( { query: `nickname=${$text.data('nickname')}&name=${$text.data('name')}&id=${id}` });

    $submitMsg.click(sendMessageToChat);
    $text.on('keyup', sendMessageToChat);
    let stop = null;
    
    function sendMessageToChat (e) {
        if (!e.keyCode || e.keyCode !== 13) {
            socket.emit('typing', $text.data('nickname'));

            if (stop !== null) {
                clearTimeout(stop);
            }

            stop = setTimeout(() => {
                socket.emit('stop typing', $text.data('nickname'));
                stop = null;
            }, 1500);

            return true;
        };
        let status = !!$text.val();
        $text.toggleClass('error', !status);
        if (!status) return;

        let data = {
            nickname: $text.data('nickname'),
            message: $text.val(),
            name: $text.data('name')
        };

        $text.val('');
        socket.emit('chat message', data);
    }

    socket.on('chat history', function (msg) {
        for (var i in msg) {
            if (msg.hasOwnProperty(i)) {
                $bodyChat.append(_buildMessages(msg[i]));
            }
        }
        _setScrolBottom();
    });

    socket.on('set id', (data) => {
        sessionStorage.setItem('__chat', data)
    });

    socket.on('online users', function (users) {
        const usersBlock = document.querySelector('.users-block');

        let template = users.map((user) => {
            const statusClass = user.status === 'just appeared' || user.status === 'online' ? 'online' : 'ofline';

            return `
                <div class="user" data-id="${user.id}">
                    <div class="${statusClass}">${user.status}</div>
                    <div class="user-name">${user.name}</div>
                    <div class="user-nickname">${user.nickname}</div>
                </div>
            `;
        });
        
        usersBlock.innerHTML = template.join('');
    });

    socket.on('typing', function (nickname) {
        const tiping = document.querySelector('.tiping');

        tiping.innerHTML = `<p>${nickname} is typing...</p>`;
    });

    socket.on('stop typing', function (nickname) {
        const tiping = document.querySelector('.tiping');

        tiping.innerHTML = '';
    });

    socket.on('chat message', function (msg) {
        $bodyChat.append(_buildMessages(msg));
        _setScrolBottom();
    });

})(jQuery);
