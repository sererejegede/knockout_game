const express = require('express');
const socket = require('socket.io');
const app = express();

// Room code
let code = '';

const server = app.listen(4111, '0.0.0.0', () => {
  console.log('Listening in on port 4111');
});

app.use(express.static('public'));

const io = socket(server);

io.on('connection', (socket) => {
  console.log('Socket id is', socket.id);
  socket.on('create', (data) => {
    code = data.code;
  });
  socket.on('join', (data) => {
    if (data.code === code) {
      io.sockets.emit('joined', data);
      console.log('Game joined');
    } else {
      console.log('Nada!');
    }
  });
});