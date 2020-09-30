import io from 'socket.io-client';

const API_URL = window.location.hostname === 'localhost' ? 'http://' : 'https://socket-mice.herokuapp.com/';

const socket = io.connect(API_URL);

const clients = {};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const createDiv = (id) => {
  // TODO: Add text with id
  const div = document.createElement('span');
  div.style.width = '40px';
  div.style.height = '40px';
  div.style.borderRadius = '30px';
  div.style.background = getRandomColor();
  div.style.position = 'absolute';
  return div;
};

socket.on('connect', () => {
  console.log('Connected to the socket server ✅');
});

socket.on('message-client-disconnected', (id) => {
  if (clients[id]) {
    document.body.removeChild(clients[id]);
  }
});

socket.on('mousemove', (event) => {
  let client = clients[event.id];
  if (!client) {
    const div = createDiv(event.id);
    clients[event.id] = div;
    client = div;
    document.body.appendChild(div);
  }
  client.style.top = `${event.y - 20}px`;
  client.style.left = `${event.x - 20}px`;
});

document.addEventListener('mousemove', (event) => {
  socket.emit('mousemove', {
    x: event.clientX,
    y: event.clientY,
  });
});
