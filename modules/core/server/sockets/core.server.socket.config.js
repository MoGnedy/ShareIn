'use strict';

// Create the Sharetools comments  configuration
var onlineUsers = require('../../../../server').onlineUsers;
module.exports = function(io, socket) {
  console.log('Core server Socket');
  console.log(onlineUsers && !onlineUsers[socket.id]);

  if (onlineUsers && !onlineUsers[socket.id]){
        onlineUsers[socket.id] = socket.request.user;
        io.emit('onlineUsers', onlineUsers);
        io.emit('chatMessage', {
          type: 'status',
          text: 'Is now connected',
          created: Date.now(),
          profileImageURL: socket.request.user.profileImageURL,
          username: socket.request.user.username
        });
      }



  socket.on('disconnect', function() {
    if (onlineUsers && onlineUsers[socket.id]){
    delete onlineUsers[socket.id];
    io.emit('chatMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      username: socket.request.user.username,
      onlineUsers: onlineUsers
    });

  }
});

};
