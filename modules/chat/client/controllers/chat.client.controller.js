'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', '$rootScope', '$location', 'Authentication', 'Socket', 'privateMessages', '$state',
  function($scope, $rootScope, $location, Authentication, Socket, privateMessages, $state) {
    // Create a messages array
    $scope.messages = [];
    $scope.authentication = Authentication;
    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // Make sure the Socket is connected
    if (!Socket.socket) {
      console.log("Chat connected");
      Socket.connect();
    }

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function(message) {
      $scope.messages.unshift(message);
      $rootScope.onlineUsers = message.onlineUsers;

    });

    // Create a controller method for sending messages
    $scope.sendMessage = function() {
      // Create a new message object
      var message = {
        text: this.messageText
      };

      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);

      // Clear the message text
      this.messageText = '';
    };

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function() {
      Socket.removeListener('chatMessage');
    });


    Socket.on('onlineUsers', function(onlineUsers) {
      $rootScope.onlineUsersUsernames =[];
      $rootScope.onlineUsers = onlineUsers;
      for (var i in onlineUsers){
        $rootScope.onlineUsersUsernames.push(onlineUsers[i].username);
      }
      console.log($rootScope.onlineUsersUsernames);
    });


    $rootScope.user_privateMsg = function(receiver) {
      // private_code = {
      //   'private_code': private_code
      // };
      console.log(receiver);
      $rootScope.privateMessages = [];
      privateMessages.getPrivateMsgs(receiver).then(function(res) {
        console.log(res);
        console.log(res && !res.status);
        if (res && !res.status) {
          console.log('true');
          console.log(res.allMessages[0].messages);
          var msgsArray = res.allMessages[0].messages.reverse();
          for (var i in msgsArray) {
            $rootScope.privateMessages.push({
              'displayName': msgsArray[i].user.displayName,
              'profileImageURL': msgsArray[i].user.profileImageURL,
              'message': msgsArray[i].message,
              'date':msgsArray[i].created
            });
            console.log(msgsArray[i].user);
          }

        } else {
          console.log("no messages");
        }

      });


    };



    $scope.sendPrivate = function() {
      if ($scope.privateText && $scope.privateText !== '') {
        var privateMessageData = {
          'private_code': $rootScope.private_code,
          'receiver': $rootScope.privateUserName,
          'private_message': $scope.privateText
        };
        console.log(privateMessageData);

        privateMessages.savePrivateMsg(privateMessageData).then(function(res) {
          console.log(res);
          var messageData = {
            'receiver': $rootScope.privateUserName.username,
            'message': $scope.privateText,
            'sender': $scope.authentication.user.username,
              'date':  new Date()
          };
          console.log(messageData);
          if (res && !res.status) {
            if ($scope.privateText !== '') {
              Socket.emit('privateMessage', messageData);
            }
            $rootScope.privateMessages.unshift({
              'displayName': $scope.authentication.user.displayName,
              'profileImageURL': $scope.authentication.user.profileImageURL,
              'message': $scope.privateText,
              'date': new Date()
            });
            $scope.privateText = '';
          } else {
            console.log("send error");
          }


        });
      }
    };
    console.log($state);
    console.log($state.current.name);
    console.log($state.current.url);
    if ($state.current.name === 'chat.private' && $state.current.url === '/:userId' && $state.params.userId !== '') {
      privateMessages.getPrivateUser({
        id: $state.params.userId
      }).then(function(res) {
        console.log(res);
        if (res && res.username && !res.status) {
          delete res.password;
          delete res.salt;
          console.log(res);

            $rootScope.privateUserName = res;
            $scope.receiverUser = res.displayName;

          $rootScope.user_privateMsg(res);
        } else {
          console.log("no messages");
        }

      },function(err){
        $state.go('not-found');
      });

    }

    Socket.on('privateMessage', function(msgData) {
      console.log(msgData);
      $scope.privateMessages.unshift(msgData);

    });

    if ($state.current.name === 'chat.all' && $state.current.url === '' ) {


      privateMessages.getConvsMsgs().then(function(res) {
        console.log(res);
        if (res && !res.status) {
          $scope.convs = res;
        } else {
          console.log("no Convs");
        }

      },function(err){
        $state.go('not-found');
      });




    }


  }
]);
