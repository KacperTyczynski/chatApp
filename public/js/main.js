const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Pobranie nazwy uzytkownika oraz pokoju z URL'a
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

//Dołączenie do pokoju
socket.emit('joinRoom', { username, room });

//Podłączenie użytkowników oraz rooms'ów
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//Wiadomosć z serwera
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Zatwierdzenie wiadomosci
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // "GET MESSAGE TEXT"
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  //Wysłanie wiadomości na serwer
  socket.emit('chatMessage', msg);

  //Wyczyszczenie treści
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//Wysłanie treści do DOM (Document Object Model) --> Zachodzą zmiany w pliku HTML
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Dodanie nazwy pokoju do DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Dodanie uzytkownika do DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Upewnienie się czy użytkownik chce opuścić chat
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Jesteś pewien że chcesz opuścić pokój?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
