const { io } = require('socket.io-client');

const url = process.env.SOCKET_URL || 'http://localhost:5000';
const s = io(url, {
  transports: ['websocket', 'polling'],
  path: '/socket.io',
});

const timer = setTimeout(() => {
  console.error('timeout');
  process.exit(2);
}, 10000);

s.on('connect', () => {
  console.log('connected', s.id);
  clearTimeout(timer);
  s.disconnect();
  process.exit(0);
});

s.on('connect_error', (e) => {
  console.error('connect_error', e && e.message);
});

s.on('reconnect_attempt', (n) => {
  console.log('reconnect_attempt', n);
});

s.on('error', (e) => {
  console.error('error', e && e.message);
});
