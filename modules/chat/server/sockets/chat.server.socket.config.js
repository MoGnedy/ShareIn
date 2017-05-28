'use strict';

// Create the chat configuration
var onlineUsers = require('../../../../server').onlineUsers;
module.exports = function(io, socket) {
  console.log("chat server Socket");
  // console.log(onlineUsers);
  // console.log(socket);
   onlineUsers[socket.id] = socket.request.user;
   console.log(onlineUsers);
  // Emit the status event when a new socket client is connected
  io.emit('chatMessage', {
    type: 'status',
    text: 'Is now connected',
    created: Date.now(),
    profileImageURL: socket.request.user.profileImageURL,
    username: socket.request.user.username
  });

  io.sockets.emit('onlineUsers',onlineUsers);

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatMessage', function(message) {
    message.type = 'message';
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;

    // Emit the 'chatMessage' event
    io.emit('chatMessage', message);
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function() {
    delete onlineUsers[socket.id];

    io.emit('chatMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      username: socket.request.user.username,
      onlineUsers: onlineUsers
    });

  });


  socket.on('privateMessage', function(msgData) {
    console.log(msgData);
    console.log(msgData.receiver);
    // console.log(onlineUsers);
    var anotherUserName = msgData.receiver;
    var receiverSocketId;
    for (var key in onlineUsers) {
      if (onlineUsers[key].username === anotherUserName) {
        receiverSocketId = key;
      }
    }

    if (receiverSocketId){
      console.log('true');
      console.log(receiverSocketId);
      console.log(io.sockets.connected[receiverSocketId]);
      if (io.sockets.connected[receiverSocketId]) {
          msgData = {'displayName': msgData.sender, 'message': msgData.message, 'created': msgData.date, 'profileImageURL': msgData.profileImageURL};
          io.sockets.connected[receiverSocketId].emit('privateMessage', msgData );
      }
    // messageData = [messageData[2], messageData[1]]
    //
    // anotherClientSocket.emit('privateMessage', messageData)
  }else{
    console.log('User is not connected');
  }

  });

};
