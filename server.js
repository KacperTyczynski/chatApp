const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/msg');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Ustawienie statycznego folderu == Znajduje odwołania w folderze public == tworzy dynamiczny URL
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatApp Bot';

// Kod odpalany gdy podłączają się użytkownicy
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //Wiadomość powitalna
    socket.emit('message', formatMessage(botName, 'Witaj! Dołączyłeś do konwersacji'));

    //Wiadomość którą widzą obecni użytkownicy gdy nowa osoba dołącza do chatu
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} dołączył do pokoju`)
      );


    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  //Nasłuchiwanie nowych wiadomości
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  //Wiadomość o opuszczeniu chatu
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} opuścił chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Serwer działa na porcie: ${PORT}`));
