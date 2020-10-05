import io from 'socket.io-client';

const API_URL = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000';

const socket = io.connect(API_URL);

const clients = [{}, {}];
const coinPosition = [];

let username = '';
let score = 0;
let blobColor = '';
let coin = null;

const createBlob = (id, text, color) => {
  const div = document.createElement('div');
  div.className = `blob ${id}`;
  div.style.background = `#${color}`;
  div.textContent = text;
  return div;
};

const createLabel = (id, text) => {
  const span = document.createElement('span');
  span.className = `label ${id}`;
  span.textContent = text.trim() || 'ANONYMOUS PLAYER';
  return span;
};

const createCoin = (top, left) => {
  coinPosition[0] = Math.floor(top * document.body.clientHeight);
  coinPosition[1] = Math.floor(left * document.body.clientWidth);
  const div = document.createElement('div');
  div.className = 'coin';
  div.style.top = `${coinPosition[0]}px`;
  div.style.left = `${coinPosition[1]}px`;
  return div;
};

socket.on('connect', () => {
  const maxLength = 100;
  while (username === '' || (username != null && username.length > maxLength)) {
    username = window.prompt(`Please enter a username. It should be no more than ${maxLength} characters in length`).toUpperCase();
  }
  blobColor = (function color(m, s, c) {
    return s[m.floor(m.random() * s.length)]
        + (c && color(m, s, c - 1));
  }(Math, '56789ABCD', 4));
});

socket.on('message-client-disconnected', (id) => {
  if (clients[0][id] && clients[1][id]) {
    document.body.removeChild(clients[0][id]);
    document.body.removeChild(clients[1][id]);
  }
});

socket.on('game-over', (winner) => {
  document.body.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'game-over';
  div.style.background = `#${winner.color}`;
  div.textContent = `${winner.name} is the winner. Refresh the page to join a new game.`;
  document.body.appendChild(div);
});

socket.on('coin-position', (position) => {
  if (coin) {
    document.body.removeChild(coin);
  }
  const div = createCoin(position.top, position.left);
  coin = div;
  document.body.appendChild(div);
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
    if (event.id === socket.io.engine.id) {
      label.style.zIndex = 1000;
      blob.style.zIndex = 1000;
    }
    document.body.appendChild(span);
    document.body.appendChild(div);
  }
  label.style.top = `${event.y - 40}px`;
  label.style.left = `${event.x - 500}px`;
  blob.style.top = `${event.y - 20}px`;
  blob.style.left = `${event.x - 20}px`;
  blob.textContent = event.score;
});

document.addEventListener('mousemove', (event) => {
  const y = event.clientY >= coinPosition[0] && event.clientY <= coinPosition[0] + 20;
  const x = event.clientX >= coinPosition[1] && event.clientX <= coinPosition[1] + 20;
  if (x && y) {
    score += 1;
    socket.emit('mousemove', {
      x: event.clientX,
      y: event.clientY,
      username,
      score,
      color: blobColor,
      isEated: true,
    });
  } else {
    socket.emit('mousemove', {
      x: event.clientX,
      y: event.clientY,
      username,
      score,
      color: blobColor,
      isEated: false,
    });
  }
});
