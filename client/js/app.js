import io from 'socket.io-client';

// TODO: Change for production mode
const API_URL = 'http://localhost:5000';

const socket = io.connect(API_URL);

const clients = [{}, {}];

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const createDiv = () => {
  const div = document.createElement('div');
  div.style.width = '40px';
  div.style.height = '40px';
  div.style.borderRadius = '30px';
  div.style.background = getRandomColor();
  div.style.position = 'absolute';
  return div;
};

const createSpan = (id) => {
  // TODO: Add text with id
  const span = document.createElement('span');
  span.style.color = '#FFFFFF';
  span.style.fontSize = '10px';
  span.style.position = 'absolute';
  span.textContent = id;
  return span;
};

socket.on('connect', () => {
  console.log('Connected to the server ✅');
});

socket.on('message-client-disconnected', (id) => {
  if (clients[0][id]) {
    document.body.removeChild(clients[0][id]);
  }
});

socket.on('mousemove', (event) => {
  let blob = clients[0][event.id];
  let label = clients[1][event.id];
  if (!blob && !label) {
    const div = createDiv();
    const span = createSpan(event.id);
    clients[0][event.id] = div;
    clients[1][event.id] = span;
    blob = div;
    label = span;
    document.body.appendChild(div);
    document.body.appendChild(span);
  }
  blob.style.top = `${event.y - 20}px`;
  blob.style.left = `${event.x - 20}px`;
  label.style.top = `${event.y - 40}px`;
  label.style.left = `${event.x - 60}px`;
});

document.addEventListener('mousemove', (event) => {
  socket.emit('mousemove', {
    x: event.clientX,
    y: event.clientY,
  });
});
