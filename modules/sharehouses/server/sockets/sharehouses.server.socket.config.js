'use strict';

// Create the Sharehouses comments  configuration
var onlineUsers = require('../../../../server').onlineUsers;
module.exports = function(io, socket) {
  console.log(onlineUsers && !onlineUsers[socket.id]);

  if (onlineUsers && !onlineUsers[socket.id]){
        onlineUsers[socket.id] = socket.request.user;
        io.emit('chatMessage', {
          type: 'status',
          text: 'Is now connected',
          created: Date.now(),
          profileImageURL: socket.request.user.profileImageURL,
          username: socket.request.user.username
        });
}
  console.log("server Sharehouses Socket");
  socket.on('sendHouseComment', function(house) {
    io.emit('UpdateHouseComments', house._id);
    io.sockets.emit('UpdateHouseComments', house._id);

  });

  socket.on('deleteHouseComment', function(comment) {
    io.emit('updateAfterDeleteHouseComments', comment);
    io.sockets.emit('updateAfterDeleteHouseComments', comment);
  });

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
