const socketIO = require('socket.io');

const init = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    io.emit('message-client-connected', socket.id);

    socket.on('mousemove', (event) => {
      io.emit('mousemove', {
        id: socket.id,
        ...event,
      });
    });

    socket.on('disconnect', () => {
      io.emit('message-client-disconnected', socket.id);
    });
  });
};

module.exports = {
  init,
};
