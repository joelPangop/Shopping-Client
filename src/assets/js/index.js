let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

io.on('connection', (socket) => {

    socket.on('disconnect', function () {
        io.emit('users-changed', {user: socket.username, event: 'left'});
    });

    socket.on('set-name', (name) => {
        socket.username = name;
        io.emit('users-changed', {user: name, event: 'joined'});
    });

    socket.on('send-message', (message) => {
        io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});
    });

    //listening for typing  event
    socket.on('typing', (message) => {
        io.emit('notify-typing',{msg: message.text, user: socket.username});
    });

    //listening for notifying  event
    socket.on('notifying', (message) => {
        io.emit('notify',{message: message, user: message.user});
    });

});

const port = process.env.PORT || 3001;

server.listen(port, function () {
    console.log('listening in http://localhost:' + port);
});
