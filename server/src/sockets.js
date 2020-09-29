const socketIO = require('socket.io');

const init = (server) => {
  const io = socketIO(server);

  io.on('connection', () => {
    console.log('Client connected ✅');
  });
};

module.exports = {
  init,
};
