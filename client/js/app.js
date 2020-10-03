import io from 'socket.io-client';

const API_URL = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000';

const socket = io.connect(API_URL);

const clients = [{}, {}];
let username = '';
const score = 0;
let blobColor = '';

const getRandomColor = () => {
  // TODO: Get only light colors
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const createBlob = (id, text, color) => {
  const div = document.createElement('div');
  div.className = `blob ${id}`;
  div.style.background = color;
  div.textContent = text;
  return div;
};

const createLabel = (id, text) => {
  const span = document.createElement('span');
  span.className = `label ${id}`;
  span.textContent = text.toUpperCase().trim() || 'ANONYMOUS PLAYER';
  return span;
};

const createCoin = () => {
  const div = document.createElement('div');
  div.className = 'coin';
  div.style.top = `${Math.floor(Math.random() * document.body.clientHeight)}px`;
  div.style.left = `${Math.floor(Math.random() * document.body.clientWidth)}px`;
  return div;
};

socket.on('connect', () => {
  const maxLength = 100;
  while (username === '' || (username != null && username.length > maxLength)) {
    username = window.prompt(`Please enter a username. It should be no more than ${maxLength} characters in length`);
  }
  blobColor = getRandomColor();
  const div = createCoin();
  document.body.appendChild(div);
});

socket.on('message-client-disconnected', (id) => {
  if (clients[0][id] && clients[1][id]) {
    document.body.removeChild(clients[0][id]);
    document.body.removeChild(clients[1][id]);
  }
});

socket.on('mousemove', (event) => {
  let label = clients[0][event.id];
  let blob = clients[1][event.id];
  if (!blob && !label) {
    const span = createLabel(event.id, event.username);
    const div = createBlob(event.id, event.score, event.color);
    clients[0][event.id] = span;
    clients[1][event.id] = div;
    label = span;
    blob = div;
    document.body.appendChild(span);
    document.body.appendChild(div);
  }
  label.style.top = `${event.y - 40}px`;
  label.style.left = `${event.x - 500}px`;
  blob.style.top = `${event.y - 20}px`;
  blob.style.left = `${event.x - 20}px`;
});

document.addEventListener('mousemove', (event) => {
  socket.emit('mousemove', {
    x: event.clientX,
    y: event.clientY,
    username,
    score,
    color: blobColor,
  });
});
