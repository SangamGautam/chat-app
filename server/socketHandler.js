module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join group', (groupName) => {
            console.log(`${socket.id} joined group ${groupName}`);
            socket.join(groupName);
        });

        socket.on('leave group', (groupName) => {
            console.log(`${socket.id} left group ${groupName}`);
            socket.leave(groupName);
        });

        socket.on('chat message', (msg, groupName) => {
            io.to(groupName).emit('chat message', msg);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
