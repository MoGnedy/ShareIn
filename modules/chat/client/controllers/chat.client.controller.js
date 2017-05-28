'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', '$rootScope', '$location', 'Authentication', 'Socket', 'privateMessages', '$state',
  function ($scope, $rootScope, $location, Authentication, Socket, privateMessages, $state) {
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
    Socket.on('chatMessage', function (message) {
      $scope.messages.unshift(message);
      $rootScope.onlineUsers = message.onlineUsers;

    });

    // Create a controller method for sending messages
    $scope.sendMessage = function () {
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
    $scope.$on('$destroy', function () {
      Socket.removeListener('chatMessage');
    });


    Socket.on('onlineUsers', function (onlineUsers) {
      $rootScope.onlineUsers = onlineUsers;
    });


    $rootScope.user_privateMsg = function(private_code) {
    private_code = {
      'private_code': private_code
    };
    $rootScope.privateMessages = [];

    privateMessages.getPrivateMsgs(private_code).then(function(res) {
      console.log(res);
      if (res && !res.status) {

        for (var i in res) {
          $rootScope.privateMessages.push({'displayName': res[i].user.displayName ,'profileImageURL': res[i].user.profileImageURL,'message': res[i].private_message});
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
        'username': $scope.authentication.user.username,
        'private_message': $scope.privateText
      };
      console.log(privateMessageData);
      var messageData = [$rootScope.privateUserName, $scope.privateText, $scope.authentication.user.username];

      privateMessages.savePrivateMsg(privateMessageData).then(function(res) {
        console.log(res);
        if (res && !res.status) {
          if ($scope.privateMessage !== []) {

            // socket.emit('privateMessage', messageData);
          }
          $rootScope.privateMessages.push($scope.authentication.user.username + " : " + $scope.privateText);
          $scope.privateMessage = [];
        } else {
          console.log("send error");
        }


      });
    }
  };
  console.log($state);
  if( $state.current.name === 'chat.private' && $state.current.url === '/:userId' && $state.params.userId !== '' ){



  }
  }
]);
