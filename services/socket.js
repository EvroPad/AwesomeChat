const socketio = require('socket.io');
const Messages = require('../models/messages');

let onlineUsers = [];

module.exports = function (server) {

    const io = socketio.listen(server);

    io.on('connection', function (socket) {

        let { name, nickname, id } = socket.request._query;
        let user = {};

        if (id === '0') {
            id = String(Math.random());
            user = {
                name,
                nickname,
                id,
                status: 'just appeared'
            }

            onlineUsers.push(user);
        } else {
            onlineUsers.forEach((user) => {
                if (user.id === id) {
                    user.status = 'just appeared';
                }
            });
        }

        setTimeout(() => {
            onlineUsers.forEach((user) => {
                if (user.id === id) {
                    user.status = 'online';
                }
            });

            io.emit('online users', onlineUsers);
        }, 60000);

        io.emit('set id', id);
        io.emit('online users', onlineUsers);

        socket.on('disconnect', function () {
            const offlineUser = onlineUsers.filter((user) => {
                if (user.id === id) {
                    user.status = 'just left';
                    return true;
                }
                return false;
            });

            const name = offlineUser[0] ? offlineUser[0].name : '';

            setTimeout(() => {
                onlineUsers.forEach((user) => {
                    if (user.id === id) {
                        user.status = 'offline';
                    }
                });
    
                io.emit('online users', onlineUsers);
            }, 60000);

            io.emit('online users', onlineUsers);

            console.log('Client send message!');

            
            let newMessage = new Messages();
            newMessage.nickname = 'Server message!';
            newMessage.message = `User ${name} left the room.`;
            newMessage.name = 'Server message!';

            console.log(offlineUser);

            newMessage.save((err, result) => {
                if (err) throw err;
                io.emit('chat message', {
                    nickname: newMessage.nickname,
                    message: newMessage.message,
                    name: newMessage.name
                });
            });
        });

        socket.on('typing', function(nickname) {
            io.emit('typing', nickname);
        });

        socket.on('stop typing', function() {
            io.emit('stop typing');
        });

        socket.on('chat message', function (data) {
            console.log('Client send message!');

            let newMessage = new Messages();
            newMessage.nickname = data.nickname;
            newMessage.message = data.message;
            newMessage.name = data.name;

            newMessage.save((err, result) => {
                if (err) throw err;
                io.emit('chat message', data);
            });
        });

        Messages.find((err, docs) => {
            socket.emit('chat history', docs);
        });
    });
};
