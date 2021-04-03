const users = [];

// Użytkownik dołącza do pokoju
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

//przypasowanie ID konkretnego uzytkownika
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

//Uzytkownik opuszcza chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Przypasowanie uzytkownika do pokoju
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
