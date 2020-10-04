const socketIO = require('socket.io');

const coinPosition = [];

const sendCoinPosition = (socket) => {
  socket.emit('coin-position', {
    top: coinPosition[0],
    left: coinPosition[1],
  });
};

const init = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {

    if (Object.keys(io.sockets.sockets).length === 1) {
      coinPosition[0] = Math.random();
      coinPosition[1] = Math.random();
    } else if (Object.keys(io.sockets.sockets).length === 0) {
      coinPosition.length = 0;
    }

    sendCoinPosition(socket);

    socket.on('mousemove', (event) => {
      if (event.isEated) {
        coinPosition[0] = Math.random();
        coinPosition[1] = Math.random();
        sendCoinPosition(socket);
      }
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
