const express = require('express');
const socket = require('socket.io');
const app = express();

// Room code
let backend_data = {};

const server = app.listen(4111, '0.0.0.0', () => {
  console.log('Listening in on port 4111');
});

app.use(express.static('public'));

const io = socket(server);

io.on('connection', (socket) => {
  console.log('Socket id is', socket.id);
  socket.on('create', (data) => {
    backend_data = data;
  });
  socket.on('join', (data) => {
    if (data.code === backend_data.code) {
      io.sockets.emit('joined', backend_data);
      console.log('Game joined', backend_data);
    } else {
      console.log('Nada!');
    }
  });
});