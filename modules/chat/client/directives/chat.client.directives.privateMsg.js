'use strict';
angular.module('chat').directive('privateMsg', function ($rootScope, $state, Authentication) {
  return {
    link: function($scope, element, attr) {
      element.on('click', function() {
        console.log("privateMsg directive");
        if (Authentication.user && Authentication.user.username) {
          $rootScope.privateUserName = attr.username;
          var private_code = '';
          var TwoNames = [Authentication.user.username, $rootScope.privateUserName].sort();
          var code = TwoNames[0] + "(#Private#)" + TwoNames[1];
          console.log(TwoNames);
          for (var i = 0; i < code.length; i++) {
            private_code += code.charCodeAt(i);
          }
          $rootScope.private_code = private_code;

          $rootScope.user_privateMsg($rootScope.private_code);
        }
        $state.go('chat.private',{userId: attr.id});


      });

    }
  };

});
