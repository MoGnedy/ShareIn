'use strict';

// Create the Sharetools comments  configuration
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
  console.log("server Sharetools Socket");
  socket.on('sendToolComment', function(tool) {
    io.emit('UpdateToolComments', tool._id);
    io.sockets.emit('UpdateToolComments', tool._id);

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
